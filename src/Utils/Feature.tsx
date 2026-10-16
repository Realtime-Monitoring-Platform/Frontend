import { Icon, IconName } from "./Icon";

export function Feature({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return <div className="feature-card"><span><Icon name={icon} /></span><h3>{title}</h3><p>{text}</p><button className="text-btn">Learn more <Icon name="chevron" size={13} /></button></div>;
}