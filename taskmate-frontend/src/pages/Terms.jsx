import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
             Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground border-none">Terms & Conditions</h1>
          <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
            Please read these terms carefully before using TaskMate.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 prose prose-invert max-w-none space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">1. Platform Usage Rules</h2>
            <p className="text-muted-foreground leading-relaxed">
              TaskMate provides a venue connecting clients with volunteers. You must be at least 18 years old to use our service. You agree not to use the platform for any illegal activities, plagiarism, academic dishonesty, or to violate any laws in your jurisdiction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">2. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              Clients are responsible for providing clear instructions and adequate budgets. Volunteers are responsible for meeting deadlines, providing original work, and maintaining professional communication. Direct sharing of contact information to bypass escrow is strictly prohibited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">3. Payments & Booking Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              All transactions must happen through TaskMate's secure escrow system. Once a task is awarded, the budget is held in escrow. Funds are released to the volunteer only when the work is approved. TaskMate takes a 10% standard platform fee on a successful completed task.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">4. Admin Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              TaskMate administrators reserve the right to review private messages and task details in the event of a dispute. We hold the absolute right to resolve disputes, issue refunds, or distribute escrowed funds based on the evidence provided by both parties.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-none">5. Account Suspension Clauses</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms, participate in fraudulent activity, harass other users, or attempt to bypass the escrow system.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
