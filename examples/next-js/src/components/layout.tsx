import Head from "next/head";

type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Head>
                <title>Layouts Example</title>
            </Head>
            <main>{children}</main>
        </>
    );
}