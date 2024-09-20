import { data } from "autoprefixer";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = { title, description, price };
        if (_id) {
            //uodate
            await axios.put('/api/products', { ...data, _id });
        } else {
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push('/products');
    }
    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {

                data.append('file', file);
            }

            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    return (
        <form onSubmit={saveProduct}>
            <label>Nombre del producto</label>
            <input type="text" placeholder="Nombre del producto" value={title}
                onChange={ev => setTitle(ev.target.value)} />
            <label>
                Fotos
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
                {!!images?.length && images.map(Link => (
                    <div key={Link} className="h-24">
                        <img src={Link} alt="" className="rounded-lg" />
                    </div>
                ))}
                <label className="w-24 h-24 cursor-cell border-red-50 text-center flex items-center justify-center text-sm gap-1 text-black rounded-lg bg-red-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Cargar
                    </div>
                    <input type="file" onChange={uploadImages}
                        className="hidden" />
                </label>

                {!images?.length && (
                    <div></div>
                )}
            </div>
            <textarea placeholder="Descripción del producto" value={description}
                onChange={ev => setDescription(ev.target.value)} />
            <input type="text" placeholder="precio" value={price}
                onChange={ev => setPrice(ev.target.value)} />
            <button type="submit" className="btn-primary">Guardar</button>
        </form>
    );
}