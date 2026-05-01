import { MenubarGroup } from "@radix-ui/react-menubar";

const Index = () => {
    return (
        <div className="flex flex-col h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <h1 className="text-3xl font-bold text-white">Bem-vindo ao Agenda Designer</h1>
            <MenubarGroup className="flex items-center gap-4 mt-6">
                <a
                    href="/agenda-semanal"
                    className="mt-4 inline-block rounded bg-white px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100"
                >
                    Agenda Semanal
                </a>
                <a
                    href="/estaticos"
                    className="mt-4 inline-block rounded bg-white px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100"
                >
                    Estáticos
                </a>
            </MenubarGroup>
        </div>
    );
};

export default Index;
