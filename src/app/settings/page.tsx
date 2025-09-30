import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { UserIcon, BellIcon, LockIcon, PaletteIcon, SettingsIcon } from "@/components/icons";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const settingsCategories = [
    {
      title: "Account",
      description: "Manage your account settings and profile",
      icon: UserIcon,
      href: "/settings/profile",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Notifications",
      description: "Configure how you receive notifications",
      icon: BellIcon,
      href: "/settings/notifications",
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Privacy & Security",
      description: "Control your privacy and security settings",
      icon: LockIcon,
      href: "/settings/privacy",
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Appearance",
      description: "Customize how BlaBla looks to you",
      icon: PaletteIcon,
      href: "/settings/appearance",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-3 mb-3">
            <SettingsIcon size={32} className="text-gray-900" />
            <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-4 sm:grid-cols-2 animate-fadeIn animation-delay-100">
          {settingsCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.href}
                href={category.href}
                className="block group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card hover className="h-full">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${category.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} className={category.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {category.description}
                      </p>
                    </div>
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
