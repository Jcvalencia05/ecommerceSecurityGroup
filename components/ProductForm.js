import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
}){
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
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
        <form onSubmit={createProduct}>
            <input type="text" placeholder="Nombre del producto" value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <textarea placeholder="Descripción del producto" value={description}
                onChange={ev => setDescription(ev.target.value)} />
            <input type="text" placeholder="precio" value={price}
                onChange={ev => setPrice(ev.target.value)} />
            <button type="submit" className="btn-primary">Guardar</button>
        </form>
    );
}