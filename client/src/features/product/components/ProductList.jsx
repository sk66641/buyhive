import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllProducts, fetchProductsByFiltersAsync, selectTotalItems, selectIsFetchingProducts, selectErrorFetchingProducts, resetProductErrors } from '../productSlice'
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { ITEMS_PER_PAGE } from '../../../app/constants'
import Pagination from '../../common/Pagination'
import { selectUserInfo } from '../../user/userSlice'
import toast, { Toaster } from 'react-hot-toast'

const sortOptions = [
    { name: 'Best Rating', sort: '-rating', id: "best-rating" },
    { name: 'Price: Low to High', sort: 'price', id: "price-low-to-high" },
    { name: 'Price: High to Low', sort: '-price', id: "price-high-to-low" },
]

// TODO: Remove hardcoded brand and category filters. Fetch options dynamically from backend models and routes (backend implemented, needs frontend integration).
export const filters =
    [
        {
            "id": "brand",
            "name": "Brands",
            "options": [
                { "value": "Essence", "label": "Essence" },
                { "value": "Glamour Beauty", "label": "Glamour Beauty" },
                { "value": "Velvet Touch", "label": "Velvet Touch" },
                { "value": "Chic Cosmetics", "label": "Chic Cosmetics" },
                { "value": "Nail Couture", "label": "Nail Couture" },
                { "value": "Calvin Klein", "label": "Calvin Klein" },
                { "value": "Chanel", "label": "Chanel" },
                { "value": "Dior", "label": "Dior" },
                { "value": "Dolce & Gabbana", "label": "Dolce & Gabbana" },
                { "value": "Gucci", "label": "Gucci" },
                { "value": "Annibale Colombo", "label": "Annibale Colombo" },
                { "value": "Furniture Co.", "label": "Furniture Co." },
                { "value": "Knoll", "label": "Knoll" },
                { "value": "Bath Trends", "label": "Bath Trends" },
                { "value": "Apple", "label": "Apple" },
                { "value": "Asus", "label": "Asus" },
                { "value": "Huawei", "label": "Huawei" },
                { "value": "Lenovo", "label": "Lenovo" },
                { "value": "Dell", "label": "Dell" },
                { "value": "Fashion Trends", "label": "Fashion Trends" },
                { "value": "Gigabyte", "label": "Gigabyte" },
                { "value": "Classic Wear", "label": "Classic Wear" },
                { "value": "Casual Comfort", "label": "Casual Comfort" },
                { "value": "Urban Chic", "label": "Urban Chic" },
                { "value": "Nike", "label": "Nike" },
                { "value": "Puma", "label": "Puma" },
                { "value": "Off White", "label": "Off White" },
                { "value": "Fashion Timepieces", "label": "Fashion Timepieces" },
                { "value": "Longines", "label": "Longines" },
                { "value": "Rolex", "label": "Rolex" },
                { "value": "Amazon", "label": "Amazon" },
                { "value": "Al Munakh", "label": "Al Munakh" }
            ]
        },
        {
            "id": "category",
            "name": "Category",
            "options": [
                { "value": "beauty", "label": "Beauty" },
                { "value": "fragrances", "label": "Fragrances" },
                { "value": "furniture", "label": "Furniture" },
                { "value": "groceries", "label": "Groceries" },
                { "value": "home-decoration", "label": "Home-decoration" },
                { "value": "kitchen-accessories", "label": "Kitchen-accessories" },
                { "value": "laptops", "label": "Laptops" },
                { "value": "mens-shirts", "label": "Mens-shirts" },
                { "value": "mens-shoes", "label": "Mens-shoes" },
                { "value": "mens-watches", "label": "Mens-watches" },
                { "value": "mobile-accessories", "label": "Mobile-accessories" },
                { "value": "womens-shoes", "label": "Womens-shoes" }
            ]
        }
    ]

// TODO: We can also show when the product was created or last updated
// TODO: Add product search functionality (we don't have to just return a single product, we need to return a list of products based on the search query)

const ProductList = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const products = useSelector(selectAllProducts)
    const totalItems = useSelector(selectTotalItems)
    const dispatch = useDispatch()
    const [filter, setFilter] = useState({})
    const [sort, setSort] = useState({})
    const [page, setPage] = useState(1)

    useEffect(() => {
        const pagination = { _page: page, _per_page: ITEMS_PER_PAGE }
        dispatch(fetchProductsByFiltersAsync({ filter, sort, pagination }))
    }, [dispatch, filter, sort, page]);


    const handleFilter = (e, section, option) => {
        const newFilter = { ...filter };
        if (e.target.checked) {
            if (newFilter[section.id]) {
                newFilter[section.id].push(option.value)
            } else {
                newFilter[section.id] = [option.value]
            }
        }
        else {
            const index = newFilter[section.id].findIndex(el => el === option.value);
            newFilter[section.id].splice(index, 1);
        }
        setFilter(newFilter);
    }

    const handleSort = (option) => {

        if (option.sort === sort._sort) {
            setSort({});
        }
        else {
            setSort({ _sort: option.sort });
        }
    }

    const handlePage = (page) => {
        setPage(page);
    }

    useEffect(() => {
        setPage(1)
    }, [totalItems, sort])


    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl">
                <div>
                    {/* Mobile filter dialog */}
                    <MobileFilter handleFilter={handleFilter} mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} filter={filter}></MobileFilter>

                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-baseline justify-between border-b border-gray-200 dark:border-gray-700 pt-24 pb-6">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Products</h1>

                            <div className="flex items-center">
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                                            Sort
                                            <ChevronDownIcon
                                                aria-hidden="true"
                                                className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                                            />
                                        </MenuButton>
                                    </div>

                                    <MenuItems
                                        transition
                                        className="absolute p-2 right-0 z-10 mt-2 w-45 origin-top-right rounded-md bg-white dark:bg-gray-800 ring-1 shadow-2xl ring-black/5 dark:ring-gray-700/50 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                    >
                                        <div className="py-1">
                                            {sortOptions.map((option) => (
                                                <MenuItem key={option.id}>
                                                    <div className="flex gap-3">
                                                        <div className="flex h-5 shrink-0 items-center">
                                                            <div className="group grid size-4 grid-cols-1">
                                                                <input
                                                                    checked={sort._sort === option.sort}
                                                                    id={option.id}
                                                                    type="checkbox"
                                                                    onChange={() => handleSort(option)}
                                                                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:checked:bg-gray-100 dark:disabled:checked:bg-gray-800 forced-colors:appearance-auto cursor-pointer"
                                                                />
                                                                <svg
                                                                    fill="none"
                                                                    viewBox="0 0 14 14"
                                                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-gray-400/25"
                                                                >
                                                                    <path
                                                                        d="M3 8L6 11L11 3.5"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="opacity-0 group-has-checked:opacity-100"
                                                                    />
                                                                    <path
                                                                        d="M3 7H11"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="opacity-0 group-has-indeterminate:opacity-100"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <label
                                                            htmlFor={option.id}
                                                            className="min-w-0 flex-1 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                                                        >
                                                            {option.name}
                                                        </label>
                                                    </div>
                                                </MenuItem>
                                            ))}
                                        </div>
                                    </MenuItems>
                                </Menu>

                                <button type="button" className="-m-2 ml-5 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 sm:ml-7">
                                    <span className="sr-only">View grid</span>
                                    <Squares2X2Icon aria-hidden="true" className="size-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="-m-2 ml-4 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 sm:ml-6 lg:hidden"
                                >
                                    <span className="sr-only">Filters</span>
                                    <FunnelIcon aria-hidden="true" className="size-5" />
                                </button>
                            </div>
                        </div>

                        <section aria-labelledby="products-heading" className="pt-6 pb-24">
                            <h2 id="products-heading" className="sr-only">
                                Products
                            </h2>

                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                                {/* Filters */}
                                <DesktopFilter handleFilter={handleFilter} filter={filter}></DesktopFilter>


                                {/* Product grid */}
                                <ProductGrid products={products}></ProductGrid>

                            </div>
                        </section>
                        {/* pagination */}
                        <Pagination totalItems={totalItems} handlePage={handlePage} page={page} setPage={setPage}></Pagination>
                    </main>
                </div>
            </div>
        </>
    )
}

export default ProductList


function MobileFilter({ handleFilter, mobileFiltersOpen, setMobileFiltersOpen, filter }) {

    return (
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/25 dark:bg-black/50 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            />

            <div className="fixed inset-0 z-40 flex">
                <DialogPanel
                    transition
                    className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white dark:bg-gray-800 py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
                >
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(false)}
                            className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white dark:bg-gray-800 p-2 text-gray-400 dark:text-gray-500"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    {/* Filters */}
                    <form className="mt-4 border-t border-gray-200 dark:border-gray-700">

                        {filters.map((section) => (
                            <Disclosure key={section.id} as="div" className="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
                                <h3 className="-mx-2 -my-3 flow-root">
                                    <DisclosureButton className="group flex w-full items-center justify-between bg-white dark:bg-gray-800 px-2 py-3 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                                        <span className="font-medium text-gray-900 dark:text-white">{section.name}</span>
                                        <span className="ml-6 flex items-center">
                                            <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                                            <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                                        </span>
                                    </DisclosureButton>
                                </h3>
                                <DisclosurePanel className="pt-6">
                                    <div className="space-y-6">
                                        {section.options.map((option, optionIdx) => (
                                            <div key={option.value} className="flex gap-3">
                                                <div className="flex h-5 shrink-0 items-center">
                                                    <div className="group grid size-4 grid-cols-1">
                                                        <input
                                                            value={option.value}
                                                            checked={filter[section.id]?.includes(option.value)}
                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                            name={`${section.id}[]`}
                                                            type="checkbox"
                                                            onChange={(e) => handleFilter(e, section, option)}
                                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:checked:bg-gray-100 dark:disabled:checked:bg-gray-800 forced-colors:appearance-auto cursor-pointer"
                                                        />
                                                        <svg
                                                            fill="none"
                                                            viewBox="0 0 14 14"
                                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-gray-400/25"
                                                        >
                                                            <path
                                                                d="M3 8L6 11L11 3.5"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-checked:opacity-100"
                                                            />
                                                            <path
                                                                d="M3 7H11"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="opacity-0 group-has-indeterminate:opacity-100"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <label
                                                    htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                    className="min-w-0 flex-1 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                                                >
                                                    {option.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </DisclosurePanel>
                            </Disclosure>
                        ))}
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
function DesktopFilter({ handleFilter, filter }) {
    return (
        <form className="hidden lg:block">

            {filters.map((section) => (
                <Disclosure key={section.id} as="div" className="border-b border-gray-200 dark:border-gray-700 py-6">
                    <h3 className="-my-3 flow-root">
                        <DisclosureButton className="cursor-pointer group flex w-full items-center justify-between bg-white dark:bg-gray-800 py-3 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">{section.name}</span>
                            <span className="ml-6 flex items-center">
                                <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                                <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                            </span>
                        </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                        <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex gap-3">
                                    <div className="flex h-5 shrink-0 items-center">
                                        <div className="group grid size-4 grid-cols-1">
                                            <input
                                                value={option.value}
                                                checked={filter[section.id]?.includes(option.value)}
                                                id={`filter-${section.id}-${optionIdx}`}
                                                name={`${section.id}[]`}
                                                type="checkbox"
                                                onChange={(e) => handleFilter(e, section, option)}
                                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:checked:bg-gray-100 dark:disabled:checked:bg-gray-800 forced-colors:appearance-auto cursor-pointer"
                                            />
                                            <svg
                                                fill="none"
                                                viewBox="0 0 14 14"
                                                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-gray-400/25"
                                            >
                                                <path
                                                    d="M3 8L6 11L11 3.5"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="opacity-0 group-has-checked:opacity-100"
                                                />
                                                <path
                                                    d="M3 7H11"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            ))}
        </form>
    )
}

function ProductGrid({ products }) {
    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const isFetchingProducts = useSelector(selectIsFetchingProducts);
    const ErrorFetchingProducts = useSelector(selectErrorFetchingProducts);

    useEffect(() => {
        if (ErrorFetchingProducts) {
            toast.error(ErrorFetchingProducts);
        }
        dispatch(resetProductErrors());
    }, [ErrorFetchingProducts, dispatch]);

    return (
        <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800">
                {user && user.role === 'admin' &&
                    <Link to={'/admin/product-form'}
                        className="inline-block mb-6 rounded-lg bg-green-600 dark:bg-green-700 px-5 py-2 text-base font-semibold text-white shadow-md hover:bg-green-500 dark:hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition"
                    >
                        Add Product
                    </Link>}
                {ErrorFetchingProducts && <p className="text-red-500 dark:text-red-400 mt-2">{ErrorFetchingProducts}</p>}
                {isFetchingProducts ?
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-10 mt-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, idx) => (
                            <div key={idx} className="flex flex-col gap-2 justify-between animate-pulse">
                                <div className="group relative flex flex-col border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 h-full">
                                    <div className="relative">
                                        <div className="aspect-square w-full bg-gray-200 dark:bg-gray-700" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between p-4">
                                        <div>
                                            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                                            <div className="flex items-center gap-2 mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="h-4 w-4 bg-yellow-100 dark:bg-gray-700 rounded" />
                                                ))}
                                                <div className="h-3 w-8 bg-gray-100 dark:bg-gray-600 rounded ml-1" />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-end justify-between">
                                            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                                            <div className="h-4 w-10 bg-gray-100 dark:bg-gray-600 rounded ml-2" />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg mt-2" />
                            </div>
                        ))}
                    </div>
                    :
                    <div className="mx-auto max-w-5xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
                        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-10">
                            {products.map((product) => {

                                const hasDiscount = product.discountPercentage && product.discountPercentage > 0;

                                return (
                                    <div key={product.id} className="flex flex-col gap-2 justify-between">
                                        <Link
                                            className="group relative flex flex-col border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full"
                                            to={`/product-details/${product.id}`}
                                        >
                                            <div className="relative">
                                                <img
                                                    alt={product.imageAlt}
                                                    src={product.images}
                                                    className="aspect-square w-full object-cover rounded-t-2xl bg-gray-100 dark:bg-gray-700 transition-transform duration-300 group-hover:scale-105"
                                                />
                                                {product.deleted ?
                                                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg drop-shadow">
                                                        Deleted
                                                    </span> :
                                                    product.stock === 0 && (
                                                        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg drop-shadow">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between p-4">
                                                <div>
                                                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[3rem]">
                                                        {product.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="flex items-center text-yellow-400">
                                                            {/* Star icons for rating */}
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <svg
                                                                    key={i}
                                                                    className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-yellow-400' : 'fill-gray-200 dark:fill-gray-600'}`}
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <polygon points="9.9,1.1 12.3,6.9 18.6,7.6 13.8,11.8 15.2,18 9.9,14.7 4.6,18 6,11.8 1.2,7.6 7.5,6.9 " />
                                                                </svg>
                                                            ))}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-medium">{product.rating}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-end justify-between">
                                                    <div>
                                                        {hasDiscount ? (
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-bold text-green-500 dark:text-green-400">
                                                                        ${product.discountedPrice}
                                                                    </span>
                                                                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200 dark:border-green-700">
                                                                        {product.discountPercentage}%
                                                                        <span className="ml-1 text-xs">
                                                                            OFF
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                                                                    ${product.price}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                                ${product.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                        {user && user.role === 'admin' &&
                                            <Link to={`/admin/product-form/edit/${product.id}`}
                                                className="rounded-lg bg-indigo-600 dark:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 dark:hover:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition mt-2"
                                            >
                                                Edit Product
                                            </Link>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>}
            </div>
            <Toaster />
        </div>
    )
}

