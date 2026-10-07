import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const templates = [
    { name: "Agenda Semanal", path: "/agenda-semanal" },
    { name: "Agenda Mensal", path: "/agenda-mensal" },
    { name: "Estáticos", path: "/estaticos" },
    { name: "Capa para YouTube", path: "/capa-youtube" },
];

const Index = () => (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground transition-colors sm:py-24">
        <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-xl flex-col justify-center sm:min-h-[calc(100vh-12rem)]">
            <header className="mb-10">
                <span className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-sm font-semibold tracking-tight text-background">CD</span>
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Church Designer</h1>
                <p className="mt-3 text-base text-muted-foreground">Escolha um template e comece a criar:</p>
            </header>

            <nav aria-label="Templates" className="template-menu divide-y divide-border border-y border-border">
                {templates.map((template, index) => (
                    <Link
                        key={template.path}
                        to={template.path}
                        className="group flex min-h-[68px] items-center gap-4 py-4 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                    >
                        <span className="w-8 text-xs tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-lg font-medium tracking-tight">{template.name}</span>
                        <ArrowUpRight size={18} className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
                    </Link>
                ))}
            </nav>
        </div>
    </main>
);

export default Index;
