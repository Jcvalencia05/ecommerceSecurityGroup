import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";


export default function NewProduct() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    async function createProduct(ev) {
        ev.preventDefault();
        const data= {title,description,price};
        await axios.post('/api/products', data);
        setGoToProducts(true);    
    }
    if(goToProducts){
        router.push('/products');
    }
    return (
        <Layout>
            <form onSubmit={createProduct}>
                <h1>Nuevo producto</h1>
                <input type="text" placeholder="Nombre del producto" value={title}
                    onChange={ev => setTitle(ev.target.value)} />
                <textarea placeholder="Descripción del producto" value={description}
                    onChange={ev => setDescription(ev.target.value)} />
                <input type="text" placeholder="precio" value={price}
                    onChange={ev => setPrice(ev.target.value)} />
                <button type="submit" className="btn-primary">Guardar</button>
            </form>

        </Layout>
    );
}