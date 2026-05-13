import {
  BriefcaseBusiness,
  Car,
  Dumbbell,
  Gift,
  HeartPulse,
  PiggyBank,
  ShoppingBasket,
  Sparkles,
  Ticket,
  Utensils,
  WalletCards,
  Wifi,
  Zap,
  Circle,
} from "lucide-react";
import type { TransactionType } from "../types";

const icons = {
  briefcase: BriefcaseBusiness,
  car: Car,
  dumbbell: Dumbbell,
  gift: Gift,
  heart: HeartPulse,
  piggy: PiggyBank,
  shopping: ShoppingBasket,
  sparkles: Sparkles,
  ticket: Ticket,
  utensils: Utensils,
  wallet: WalletCards,
  wifi: Wifi,
  zap: Zap,
};

type IconBadgeProps = {
  icon: string;
  type?: TransactionType;
};

export function IconBadge({ icon, type = "expense" }: IconBadgeProps) {
  const Icon = icons[icon as keyof typeof icons] ?? Circle;

  return (
    <span className={`icon-badge ${type}`}>
      <Icon size={19} strokeWidth={2.2} />
    </span>
  );
}
