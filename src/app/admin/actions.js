"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order, { ORDER_STATUSES } from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Coupon from "@/lib/models/Coupon";

const str = (fd, k, max = 300) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function updateOrder(formData) {
  await requireAdmin();
  await connectDB();
  const id = str(formData, "id", 40);
  const status = str(formData, "status", 20);
  const note = str(formData, "note", 500);
  const order = await Order.findById(id);
  if (!order) throw new Error("Order not found");

  const changed = ORDER_STATUSES.includes(status) && status !== order.status;
  if (changed) order.status = status;
  order.tracking = { carrier: str(formData, "carrier", 60), number: str(formData, "trackingNumber", 80), url: str(formData, "trackingUrl", 300) };
  if (changed || note) order.history.push({ status: order.status, note: note || "Status updated" });
  await order.save();
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}

export async function saveProduct(formData) {
  await requireAdmin();
  await connectDB();
  const id = str(formData, "id", 40);
  const data = {
    name: str(formData, "name", 120),
    variant: str(formData, "variant", 80),
    slug: str(formData, "slug", 80).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, ""),
    category: str(formData, "category", 10) === "gift" ? "gift" : "pack",
    mix: ["dryfruit", "berries", "both"].includes(str(formData, "mix", 10)) ? str(formData, "mix", 10) : "dryfruit",
    description: str(formData, "description", 1000),
    price: Math.max(0, Math.round(Number(formData.get("price")) || 0)),
    mrp: (() => {
      const v = String(formData.get("mrp") ?? "").trim();
      const n = Math.round(Number(v));
      return v && Number.isFinite(n) && n > 0 ? n : null;
    })(),
    pairPrice: (() => {
      const v = String(formData.get("pairPrice") ?? "").trim();
      const n = Math.round(Number(v));
      return v && Number.isFinite(n) && n > 0 ? n : null;
    })(),
    stock: Math.max(0, Math.floor(Number(formData.get("stock")) || 0)),
    image: str(formData, "image", 300),
    sort: Math.floor(Number(formData.get("sort")) || 0),
    active: formData.get("active") === "on",
    purchasable: formData.get("purchasable") === "on",
  };
  if (!data.name || !data.variant || !data.slug) throw new Error("Name, variant and slug are required.");

  if (id && id !== "new") await Product.findByIdAndUpdate(id, data, { runValidators: true });
  else await Product.create(data);

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products?saved=1");
}

const numOrNull = (fd, k) => {
  const v = String(fd.get(k) ?? "").trim();
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};
// <input type="date"> gives "YYYY-MM-DD"; treat it as Indian time (start of day / end of day).
const dateOrNull = (fd, k, endOfDay) => {
  const v = String(fd.get(k) ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return null;
  return new Date(`${v}T${endOfDay ? "23:59:59" : "00:00:00"}+05:30`);
};

export async function saveCoupon(formData) {
  await requireAdmin();
  await connectDB();
  const id = str(formData, "id", 40);
  const rawType = str(formData, "type", 10);
  const type = ["flat", "freeship"].includes(rawType) ? rawType : "percent";
  const value = type === "freeship" ? 0 : numOrNull(formData, "value") ?? 0;
  const data = {
    code: str(formData, "code", 30).toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
    description: str(formData, "description", 120),
    type,
    value: type === "percent" ? Math.min(100, value) : value,
    minSubtotal: numOrNull(formData, "minSubtotal") ?? 0,
    maxDiscount: type === "percent" ? numOrNull(formData, "maxDiscount") : null,
    startsAt: dateOrNull(formData, "startsAt", false),
    endsAt: dateOrNull(formData, "endsAt", true),
    usageLimit: numOrNull(formData, "usageLimit"),
    onePerCustomer: formData.get("onePerCustomer") === "on",
    active: formData.get("active") === "on",
  };
  if (!data.code || (type !== "freeship" && data.value <= 0)) throw new Error("A code and a value above 0 are required.");

  try {
    if (id && id !== "new") await Coupon.findByIdAndUpdate(id, data, { runValidators: true });
    else await Coupon.create(data);
  } catch (err) {
    if (err?.code === 11000) redirect(`/admin/coupons/${id || "new"}?error=duplicate`);
    throw err;
  }

  revalidatePath("/admin/coupons");
  redirect("/admin/coupons?saved=1");
}
