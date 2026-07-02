import type { SVGProps } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  X,
  Plus,
  Search,
  Send,
  Mic,
  Paperclip,
  MoreHorizontal,
  MoreVertical,
  Check,
  Star,
  Hash,
  Mail,
  Inbox,
  Notebook,
  MessageCircle,
  Sparkles,
  Settings,
  Calendar,
  Bell,
  Bookmark,
  Trash2,
  Pencil,
  ExternalLink,
  ArrowUpRight,
  Folder,
  Code,
  Terminal,
  LayoutGrid,
  Loader,
  Reply,
  Archive,
  Dot,
  Sun,
  Moon,
  Layers,
  RefreshCw,
  Lock,
  Minus,
  Minimize2,
  Maximize,
  Wifi,
  Battery,
  Copy,
  Phone,
  Video,
  Users,
  File,
  Image,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Monitor,
  Smartphone,
  AppWindow,
  Home,
  Volume2,
  Bluetooth,
  Delete,
  PhoneCall,
  Contact,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Download,
  Globe,
  ThumbsUp,
  MessageSquare,
  Plane,
  Package,
  Car,
  Satellite,
  Square,
  Target,
  Clock,
  DollarSign,
  Leaf,
  Zap,
  ShoppingCart,
  Wallet,
  PanelRight,
  Heart,
  RotateCw,
  PictureInPicture2,
  type LucideIcon,
} from "lucide-react";

/**
 * The kit's icon set, backed by Lucide (https://lucide.dev). Keeping a local
 * kebab-case `IconName` union — rather than importing Lucide components
 * directly everywhere — means call sites (`<Icon name="chevron-down" />`)
 * stay stable even if the underlying icon library or specific glyphs change.
 */
export type IconName =
  | "chevron-down"
  | "chevron-right"
  | "chevron-left"
  | "chevron-up"
  | "close"
  | "plus"
  | "search"
  | "send"
  | "mic"
  | "attach"
  | "more-horizontal"
  | "more-vertical"
  | "check"
  | "star"
  | "hash"
  | "mail"
  | "inbox"
  | "notebook"
  | "chat"
  | "sparkles"
  | "settings"
  | "calendar"
  | "bell"
  | "bookmark"
  | "trash"
  | "edit"
  | "external-link"
  | "arrow-up-right"
  | "folder"
  | "code"
  | "terminal"
  | "grid"
  | "loader"
  | "reply"
  | "archive"
  | "paperclip-off"
  | "dot"
  | "sun"
  | "moon"
  | "layers"
  | "refresh"
  | "lock"
  | "minus"
  | "minimize-2"
  | "maximize"
  | "wifi"
  | "battery"
  | "copy"
  | "phone"
  | "video"
  | "users"
  | "file"
  | "image"
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "link"
  | "list"
  | "list-ordered"
  | "quote"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "paragraph"
  | "undo"
  | "redo"
  | "align-left"
  | "align-center"
  | "align-right"
  | "monitor"
  | "smartphone"
  | "app-window"
  | "home"
  | "volume"
  | "bluetooth"
  | "delete"
  | "phone-call"
  | "contact"
  | "play"
  | "pause"
  | "skip-back"
  | "skip-forward"
  | "shuffle"
  | "repeat"
  | "download"
  | "globe"
  | "thumbs-up"
  | "message-square"
  | "plane"
  | "package"
  | "car"
  | "satellite"
  | "square"
  | "target"
  | "clock"
  | "dollar-sign"
  | "leaf"
  | "zap"
  | "shopping-cart"
  | "wallet"
  | "panel-right"
  | "heart"
  | "replay"
  | "picture-in-picture";

const icons: Record<IconName, LucideIcon> = {
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  "chevron-up": ChevronUp,
  close: X,
  plus: Plus,
  search: Search,
  send: Send,
  mic: Mic,
  attach: Paperclip,
  "more-horizontal": MoreHorizontal,
  "more-vertical": MoreVertical,
  check: Check,
  star: Star,
  hash: Hash,
  mail: Mail,
  inbox: Inbox,
  notebook: Notebook,
  chat: MessageCircle,
  sparkles: Sparkles,
  settings: Settings,
  calendar: Calendar,
  bell: Bell,
  bookmark: Bookmark,
  trash: Trash2,
  edit: Pencil,
  "external-link": ExternalLink,
  "arrow-up-right": ArrowUpRight,
  folder: Folder,
  code: Code,
  terminal: Terminal,
  grid: LayoutGrid,
  loader: Loader,
  reply: Reply,
  archive: Archive,
  // Lucide has no direct "paperclip-off" glyph; fall back to the base icon.
  "paperclip-off": Paperclip,
  dot: Dot,
  sun: Sun,
  moon: Moon,
  layers: Layers,
  refresh: RefreshCw,
  lock: Lock,
  minus: Minus,
  "minimize-2": Minimize2,
  maximize: Maximize,
  wifi: Wifi,
  battery: Battery,
  copy: Copy,
  phone: Phone,
  video: Video,
  users: Users,
  file: File,
  image: Image,
  bold: Bold,
  italic: Italic,
  underline: Underline,
  strikethrough: Strikethrough,
  link: Link2,
  list: List,
  "list-ordered": ListOrdered,
  quote: Quote,
  "heading-1": Heading1,
  "heading-2": Heading2,
  "heading-3": Heading3,
  paragraph: Pilcrow,
  undo: Undo2,
  redo: Redo2,
  "align-left": AlignLeft,
  "align-center": AlignCenter,
  "align-right": AlignRight,
  monitor: Monitor,
  smartphone: Smartphone,
  "app-window": AppWindow,
  home: Home,
  volume: Volume2,
  bluetooth: Bluetooth,
  delete: Delete,
  "phone-call": PhoneCall,
  contact: Contact,
  play: Play,
  pause: Pause,
  "skip-back": SkipBack,
  "skip-forward": SkipForward,
  shuffle: Shuffle,
  repeat: Repeat,
  download: Download,
  globe: Globe,
  "thumbs-up": ThumbsUp,
  "message-square": MessageSquare,
  plane: Plane,
  package: Package,
  car: Car,
  satellite: Satellite,
  square: Square,
  target: Target,
  clock: Clock,
  "dollar-sign": DollarSign,
  leaf: Leaf,
  zap: Zap,
  "shopping-cart": ShoppingCart,
  wallet: Wallet,
  "panel-right": PanelRight,
  heart: Heart,
  replay: RotateCw,
  "picture-in-picture": PictureInPicture2,
};

/** Icons that read better filled (e.g. an active "starred" state) than stroked. */
const FILLED_ICONS: ReadonlySet<IconName> = new Set(["star", "dot", "sparkles", "heart"]);

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ name, size = 16, strokeWidth = 1.75, ...rest }: IconProps) {
  const IconComponent = icons[name];
  const isFilled = FILLED_ICONS.has(name);

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      fill={isFilled ? "currentColor" : "none"}
      stroke={isFilled ? "none" : "currentColor"}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  );
}
