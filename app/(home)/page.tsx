import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import { canUserAddTransaction } from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-report-button";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  
  const monthIsInvalid = !month || !isMatch(month, "MM");
  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`);
  }
  
  const dashboard = await getDashboard(month);
  const userCanAddTransaction = await canUserAddTransaction();
  const user = await clerkClient().users.getUser(userId);

  return (
    <>
      <div className="flex flex-col space-y-6 p-6 lg:h-full ">
        <div className="flex flex-col gap-4 items-center sm:flex-row sm:justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex w-full flex-col gap-3 min-[375px]:w-auto min-[375px]:flex-row items-center">
            <AiReportButton month={month} hasPremiumPlan={user.publicMetadata.subscriptionPlan === "premium"} />
            <TimeSelect />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:h-full lg:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-6">
            <SummaryCards month={month} {...dashboard} userCanAddTransaction={userCanAddTransaction} />
            <div className="flex flex-col gap-6 lg:grid lg:h-full lg:grid-cols-3 lg:grid-rows-1">
              <TransactionsPieChart {...dashboard} />
              <ExpensesPerCategory expensesPerCategory={dashboard.totalExpensePerCategory} />
            </div>
          </div>
          <LastTransactions lastTransactions={dashboard.lastTransactions} />
        </div>
      </div>
    </>
  );
};

export default Home;