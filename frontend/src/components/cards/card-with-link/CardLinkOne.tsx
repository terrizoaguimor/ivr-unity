import { CardDescription, CardTitle } from "../../ui/card";
import { Link } from "react-router";

export default function CardLinkOne() {
  return (
    <div>
      <div className="glass-card rounded-xl p-5 sm:p-6">
        <div>
          <CardTitle>Card title</CardTitle>

          <CardDescription>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi
            architecto aspernatur cum et ipsum
          </CardDescription>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-3 mt-4 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}
