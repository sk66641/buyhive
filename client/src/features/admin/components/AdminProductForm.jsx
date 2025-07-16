import { filters } from '../../product/components/productList'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createProductAsync, fetchProductsByIdAsync, selectedProductById, updateProductAsync } from '../../product/productSlice';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';


const colors = [
    { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400', id: 'white' },
    { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400', id: 'gray' },
    { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900', id: 'black' },
]
const sizes = [
    { name: 'XXS', inStock: false, id: 'xxs' },
    { name: 'XS', inStock: true, id: 'xs' },
    { name: 'S', inStock: true, id: 's' },
    { name: 'M', inStock: true, id: 'm' },
    { name: 'L', inStock: true, id: 'l' },
    { name: 'XL', inStock: true, id: 'xl' },
    { name: '2XL', inStock: true, id: '2xl' },
    { name: '3XL', inStock: true, id: '3xl' },
]

export default function AdminProductForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();
    const params = useParams();
    const selectedProduct = useSelector(selectedProductById);
    useEffect(() => {
        if (params.id) {
            dispatch(fetchProductsByIdAsync(params.id));
        }
    }, [params.id, dispatch])
    useEffect(() => {
        if (selectedProduct && params.id) {
            setValue('title', selectedProduct.title);
            setValue('description', selectedProduct.description);
            setValue('price', selectedProduct.price);
            setValue('discountPercentage', selectedProduct.discountPercentage);
            setValue('thumbnail', selectedProduct.thumbnail);
            setValue('stock', selectedProduct.stock);
            setValue('brand', selectedProduct.brand);
            setValue('category', selectedProduct.category);
            setValue('images', selectedProduct.images[0]);
            setValue('details', selectedProduct.details);
            setValue('colors', selectedProduct.colors.map(color => color.id));
            setValue('sizes', selectedProduct.sizes.map(size => size.id));
            selectedProduct.highlights.forEach((highlight, i) => setValue(`highlights${i + 1}`, highlight));
        }
    }, [selectedProduct])

    const handleDelete = () => {
        dispatch(updateProductAsync({ ...selectedProduct, deleted: true }));
    }

    return (

        <form noValidate onSubmit={handleSubmit((data) => {
            const product = {
                ...data,
                images: [data.images],
                highlights: [data.highlight1, data.highlight2, data.highlight3, data.highlight4],
                rating: 4.5,
                stock: +data.stock,
                discountPercentage: +data.discountPercentage,
            }
            product.colors = data.colors ? data.colors.map(color => colors.find(c => c.id === color)) : [];
            product.sizes = data.sizes ? data.sizes.map(size => sizes.find(s => s.id === size)) : [];
            console.log(product);
            return;
            if (params.id) {
                dispatch(updateProductAsync({ ...product, id: params.id, rating: selectedProduct.rating })).unwrap()
                    .then(() => navigate('/admin', { replace: true }))
                    .catch((error) => console.error('Failed to update the product: ', error));
            }
            else {
                dispatch(createProductAsync(product)).unwrap()
                    .then(() => navigate('/admin', { replace: true }))
                    .catch((error) => console.error('Failed to save the product: ', error));
            }

        })}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Add Product</h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label htmlFor="title" className="block text-sm/6 font-medium text-gray-900">
                                Product Name
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        id="title"
                                        type="text"
                                        {...register('title', {
                                            required: 'title is required',
                                        })}
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                                Description
                            </label>
                            <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about the product.</p>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    rows={3}
                                    {...register('description', {
                                        required: 'description is required',
                                    })}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={''}
                                />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="col-span-full">
                            <label htmlFor="details" className="block text-sm/6 font-medium text-gray-900">
                                Details
                            </label>
                            <p className="mt-3 text-sm/6 text-gray-600">Write details about the product.</p>
                            <div className="mt-2">
                                <textarea
                                    id="details"
                                    rows={3}
                                    {...register('details', {
                                        required: 'details is required',
                                    })}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={''}
                                />
                            </div>
                        </div>

                        {/* Colors, Sizes, and Highlights Section */}
                        <div className="col-span-full">
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Colors
                            </label>
                            <div className="mt-2 flex flex-wrap gap-4">
                                {colors.map((color) => (
                                    <label key={color.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={color.id}
                                            {...register('colors')}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <span className={`inline-block w-6 h-6 rounded-full ${color.class} border`} />
                                        <span>{color.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Sizes
                            </label>
                            <div className="mt-2 flex flex-wrap gap-4">
                                {sizes.map((size) => (
                                    <label key={size.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            value={size.id}
                                            {...register('sizes')}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <span>{size.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Highlights
                            </label>
                            <p className="mt-1 text-xs text-gray-500">Add 4 highlights.</p>
                            {[1, 2, 3, 4].map((index) => (
                                <div key={index} className="mt-2">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                        <input
                                            type="text"
                                            {...register(`highlight${index}`, { required: `highlight ${index} is required` })}
                                            placeholder={`Highlight ${index}`}
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="sm:col-span-3">
                            <div
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Brand
                            </div>
                            <div className="mt-2">
                                <select
                                    {...register('brand', {
                                        required: 'brand is required',
                                    })}
                                    className='p-2 border'
                                >
                                    <option value="">--choose brand--</option>
                                    {filters[0].options.map((brand) => (
                                        <option key={brand.value} value={brand.value}>{brand.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <div
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Categories
                            </div>
                            <div className="mt-2">
                                <select
                                    {...register('category', {
                                        required: 'category is required',
                                    })}
                                    className='border p-2'
                                >
                                    <option value="">--choose categories--</option>
                                    {filters[1].options.map((category) => (
                                        <option key={category.value} value={category.value}>{category.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
                                Price
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        id="price"
                                        type="number"
                                        {...register('price', {
                                            required: 'price is required',
                                            min: 0,
                                            max: 10000,
                                        })}

                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="discount" className="block text-sm/6 font-medium text-gray-900">
                                Discount
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    {/* <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">workcation.com/</div> */}
                                    <input
                                        id="discount"
                                        type="number"
                                        {...register('discountPercentage', {
                                            required: 'discount is required',
                                            min: 0,
                                            max: 100,
                                        })}
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="stock" className="block text-sm/6 font-medium text-gray-900">
                                Stock
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    {/* <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">workcation.com/</div> */}
                                    <input
                                        id="stock"
                                        type="number"
                                        {...register('stock', {
                                            required: 'stock is required',
                                            min: 0,
                                        })}
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="thumbnail" className="block text-sm/6 font-medium text-gray-900">
                                Thumbnail
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    {/* <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">workcation.com/</div> */}
                                    <input
                                        id="thumbnail"
                                        type="text"
                                        {...register('thumbnail', {
                                            required: 'thumbnail is required',
                                        })}
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="images" className="block text-sm/6 font-medium text-gray-900">
                                Image
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    {/* <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">workcation.com/</div> */}
                                    <input
                                        id="images"
                                        type="text"
                                        {...register('images', {
                                            required: 'image is required',
                                        })}
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <Link to={'/admin'} className="text-sm/6 font-semibold text-gray-900">
                    Cancel
                </Link>
                {params.id && selectedProduct &&
                    <button onClick={handleDelete}
                        type="submit"
                        disabled={selectedProduct.deleted}
                        className={`rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${selectedProduct.deleted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {selectedProduct.deleted ? 'Deleted' : 'Delete'}
                    </button>}
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                >
                    Save
                </button>
            </div>
        </form>
    )
}
