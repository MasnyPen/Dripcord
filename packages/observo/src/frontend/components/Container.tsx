export default function Container({ children, title, className = "" }) {
    return (
        <section className={"p-4 w-full h-full bg-zinc-900 rounded-2xl flex flex-col " + className}>
            <h1 className="text-xl font-bold mb-2">{title}</h1>
            {children}
        </section>
    )
}
