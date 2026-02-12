import { CardDescription, CardTitle } from "../../ui/card";
import { Link } from "react-router";

export default function CardFour() {
  return (
    <div>
      <div className="glass-card flex flex-col gap-5 rounded-xl p-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="overflow-hidden rounded-lg">
          <img
            src="/images/cards/card-01.png"
            alt="card"
            className="overflow-hidden rounded-lg"
          />
        </div>
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
