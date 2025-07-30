import {
  Shield,
  Package,
  Users,
  BarChart3,
  Settings,
  ShoppingBag,
} from "lucide-react";
import CardTitle from "../ui/card/cardTitle";
import CardContent from "../ui/cardContent";
import CardDescription from "../ui/card/CardDescription";
import Card from "../ui/card";
import CardHeader from "../ui/cardHeader";
import ActionButton from "../ui/ActionButton";
import Link from "next/link";

const Actions = ({ isAdmin, products, adminStatsData, userActions }) => {
  return (
    <div className="space-y-6">
      {isAdmin ? (
        /* Admin Tools */
        <Card variant="premium">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
              Admin Tools
            </CardTitle>
            <CardDescription>
              Administrative functions and controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/products" className="block">
                <ActionButton
                  icon={Package}
                  title="Manage Products"
                  description={`${products.length} products in system`}
                  onClick={() => console.log("Navigate to product management")}
                />
              </Link>

              <Link href="/admin/users" className="block">
                <ActionButton
                  icon={Users}
                  title="User Management"
                  description={`${adminStatsData.totalUsers} registered users`}
                  onClick={() => console.log("Navigate to user management")}
                />
              </Link>
              <Link href="/admin/analytics" className="block">
                <ActionButton
                  icon={BarChart3}
                  title="Analytics Dashboard"
                  description="View system analytics"
                  onClick={() => console.log("Navigate to analytics")}
                />
              </Link>
              <ActionButton
                icon={Settings}
                title="System Settings"
                description="Configure system settings"
                onClick={() => console.log("Navigate to settings")}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        /* User Actions */
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              Quick Actions
            </CardTitle>
            <CardDescription>Manage your shopping experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userActions.map((action, index) => (
                <ActionButton key={index} {...action} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Actions;
