import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';


export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));


function Categories({ swal }) {

    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState();
    const [EditingCategory, setEditiginCategory] = useState(null);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }


    function deleteCategory(category) {
        swal.fire({
            title: 'Estas seguro?',
            text: `Quieres eliminar ${category.name} ?`,
            showCancelButton: true,
            cancelButton: 'Cancelar',
            confirmButton: 'Si',
            confirmButtonColor: '#008000'
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id)
            }
            fetchCategories();
        });
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }]
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }


    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(','),
            }))
        }
        if (EditingCategory) {
            data._id = EditingCategory._id
            await axios.put('api/categories', data);
            setEditiginCategory(null);
        } else {
            await axios.post('api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    function editCategory(category) {
        setEditiginCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(',')
            })

            ));

    }

    return (
        <Layout>
            <h1>Categorias</h1>
            <label>
                {EditingCategory ? `Editar Categoria ${EditingCategory.name}`
                    : 'Crear Categoria'}
            </label>

            <form onSubmit={saveCategory}>

                <div className="flex gap-1">
                    <input
                        type="text"
                        placeholder={'Nombre de la Categoria'}
                        value={name}
                        onChange={ev => setName(ev.target.value)} />

                    <select
                        onChange={ev => setParentCategory(ev.target.value)}
                        value={parentCategory}>

                        <option value=""> No Categoría superior </option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}> {category.name} </option>
                        ))}

                    </select>
                </div>

                <div className="mb-1">
                    <label className="block">Propiedades</label>
                    <button type="button"
                        className="btn-default text-sm mb-2"
                        onClick={addProperty}>
                        Agregar Nueva Propiedad
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-2">
                            <input
                                type="text"
                                className="mb-0"
                                value={property.name}
                                placeholder="Nombre de la Propiedad"
                                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                            />
                            <input
                                type="text"
                                value={property.values}
                                className="mb-0"
                                placeholder="Valores, separados por comas"
                                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                            />
                            <button
                                className="btn-default"
                                onClick={() => removeProperty(index)}
                                type="button"> Eliminar </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-1">
                    {EditingCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditiginCategory(null);
                                setName('');
                                setParentCategory('')
                                setProperties([]);
                            }}
                            className="btn-default">Cancelar</button>
                    )}

                    <button
                        type="submit"
                        className="btn-primary">Guardar</button>
                </div>

            </form>
            {!EditingCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Nombre de la Categoria</td>
                            <td>Categoría superior</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>

                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button
                                        onClick={() => editCategory(category)}
                                        className="btn-primary mr-1"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category)}
                                        className="btn-primary"> Eliminar </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </Layout>
    )
}