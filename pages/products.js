import Layout from "@/components/Layout";
import Link from "next/link";

export default function Productos(){
    return (
        <Layout>
            <Link className="bg-red-500 text-white py-1 px-2 rounded-md" href={'/products/new'}>Agregar un producto</Link>
        </Layout>
    );
}