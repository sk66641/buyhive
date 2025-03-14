import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllProducts, fetchAllProductsAsync, fetchProductsByFiltersAsync, selectTotalItems } from '../productSlice'
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
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import { ITEMS_PER_PAGE } from '../../../app/constants'

const sortOptions = [
    // { name: 'Most Popular', sort: 'reviews.length', current: true },
    { name: 'Best Rating', sort: '-rating', current: false },
    { name: 'Price: Low to High', sort: 'price', current: false },
    { name: 'Price: High to Low', sort: '-price', current: false },
]
const filters = [
    {
        id: 'brand',
        name: 'Brands',
        options: [
            { value: 'Apple', label: 'Apple', checked: false },
            { value: 'Samsung', label: 'Samsung', checked: false },
            { value: 'OPPO', label: 'OPPO', checked: false },
            { value: 'Huawei', label: 'Huawei', checked: false },
            { value: 'Microsoft Surface', label: 'Microsoft Surface', checked: false, },
            { value: 'Infinix', label: 'Infinix', checked: false },
            { value: 'HP Pavilion', label: 'HP Pavilion', checked: false },
            { value: 'Impression of Acqua Di Gio', label: 'Impression of Acqua Di Gio', checked: false },
            { value: 'Royal_Mirage', label: 'Royal_Mirage', checked: false },
            { value: 'Fog Scent Xpressio', label: 'Fog Scent Xpressio', checked: false },
            { value: 'Al Munakh', label: 'Al Munakh', checked: false },
            { value: 'Lord - Al-Rehab', label: 'Lord   Al Rehab', checked: false },
            { value: "L'Oreal Paris", label: "L'Oreal Paris", checked: false },
            { value: 'Hemani Tea', label: 'Hemani Tea', checked: false },
            { value: 'Dermive', label: 'Dermive', checked: false },
            { value: 'ROREC White Rice', label: 'ROREC White Rice', checked: false },
            { value: 'Fair & Clear', label: 'Fair & Clear', checked: false },
            { value: 'Saaf & Khaas', label: 'Saaf & Khaas', checked: false },
            { value: 'Bake Parlor Big', label: 'Bake Parlor Big', checked: false },
            {
                value: 'Baking Food Items',
                label: 'Baking Food Items',
                checked: false,
            },
            { value: 'fauji', label: 'fauji', checked: false },
            { value: 'Dry Rose', label: 'Dry Rose', checked: false },
            { value: 'Boho Decor', label: 'Boho Decor', checked: false },
            { value: 'Flying Wooden', label: 'Flying Wooden', checked: false },
            { value: 'LED Lights', label: 'LED Lights', checked: false },
            { value: 'luxury palace', label: 'luxury palace', checked: false },
            { value: 'Golden', label: 'Golden', checked: false },
            {
                value: 'Furniture Bed Set',
                label: 'Furniture Bed Set',
                checked: false,
            },
            { value: 'Ratttan Outdoor', label: 'Ratttan Outdoor', checked: false },
            { value: 'Kitchen Shelf', label: 'Kitchen Shelf', checked: false },
            { value: 'Multi Purpose', label: 'Multi Purpose', checked: false },
            { value: 'AmnaMart', label: 'AmnaMart', checked: false },
            {
                value: 'Professional Wear',
                label: 'Professional Wear',
                checked: false,
            },
            { value: 'Soft Cotton', label: 'Soft Cotton', checked: false },
            { value: 'Top Sweater', label: 'Top Sweater', checked: false },
            {
                value: 'RED MICKY MOUSE..',
                label: 'RED MICKY MOUSE..',
                checked: false,
            },
            { value: 'Digital Printed', label: 'Digital Printed', checked: false },
            { value: 'Ghazi Fabric', label: 'Ghazi Fabric', checked: false },
            { value: 'IELGY', label: 'IELGY', checked: false },
            { value: 'IELGY fashion', label: 'IELGY fashion', checked: false },
            {
                value: 'Synthetic Leather',
                label: 'Synthetic Leather',
                checked: false,
            },
            {
                value: 'Sandals Flip Flops',
                label: 'Sandals Flip Flops',
                checked: false,
            },
            { value: 'Maasai Sandals', label: 'Maasai Sandals', checked: false },
            { value: 'Arrivals Genuine', label: 'Arrivals Genuine', checked: false },
            { value: 'Vintage Apparel', label: 'Vintage Apparel', checked: false },
            { value: 'FREE FIRE', label: 'FREE FIRE', checked: false },
            { value: 'The Warehouse', label: 'The Warehouse', checked: false },
            { value: 'Sneakers', label: 'Sneakers', checked: false },
            { value: 'Rubber', label: 'Rubber', checked: false },
            { value: 'Naviforce', label: 'Naviforce', checked: false },
            { value: 'SKMEI 9117', label: 'SKMEI 9117', checked: false },
            { value: 'Strap Skeleton', label: 'Strap Skeleton', checked: false },
            { value: 'Stainless', label: 'Stainless', checked: false },
            { value: 'Eastern Watches', label: 'Eastern Watches', checked: false },
            { value: 'Luxury Digital', label: 'Luxury Digital', checked: false },
            { value: 'Watch Pearls', label: 'Watch Pearls', checked: false },
            { value: 'Bracelet', label: 'Bracelet', checked: false },
            { value: 'LouisWill', label: 'LouisWill', checked: false },
            { value: 'Copenhagen Luxe', label: 'Copenhagen Luxe', checked: false },
            { value: 'Steal Frame', label: 'Steal Frame', checked: false },
            { value: 'Darojay', label: 'Darojay', checked: false },
            {
                value: 'Fashion Jewellery',
                label: 'Fashion Jewellery',
                checked: false,
            },
            { value: 'Cuff Butterfly', label: 'Cuff Butterfly', checked: false },
            {
                value: 'Designer Sun Glasses',
                label: 'Designer Sun Glasses',
                checked: false,
            },
            { value: 'mastar watch', label: 'mastar watch', checked: false },
            { value: 'Car Aux', label: 'Car Aux', checked: false },
            { value: 'W1209 DC12V', label: 'W1209 DC12V', checked: false },
            { value: 'TC Reusable', label: 'TC Reusable', checked: false },
            { value: 'Neon LED Light', label: 'Neon LED Light', checked: false },
            {
                value: 'METRO 70cc Motorcycle - MR70',
                label: 'METRO 70cc Motorcycle   MR70',
                checked: false,
            },
            { value: 'BRAVE BULL', label: 'BRAVE BULL', checked: false },
            { value: 'shock absorber', label: 'shock absorber', checked: false },
            { value: 'JIEPOLLY', label: 'JIEPOLLY', checked: false },
            { value: 'Xiangle', label: 'Xiangle', checked: false },
            {
                value: 'lightingbrilliance',
                label: 'lightingbrilliance',
                checked: false,
            },
            { value: 'Ifei Home', label: 'Ifei Home', checked: false },
            { value: 'DADAWU', label: 'DADAWU', checked: false },
            { value: 'YIOSI', label: 'YIOSI', checked: false },
        ],
    },
    {
        id: 'category',
        name: 'Category',
        options: [
            { value: 'smartphones', label: 'smartphones', checked: false },
            { value: 'laptops', label: 'laptops', checked: false },
            { value: 'fragrances', label: 'fragrances', checked: false },
            { value: 'skincare', label: 'skincare', checked: false },
            { value: 'groceries', label: 'groceries', checked: false },
            { value: 'home-decoration', label: 'home decoration', checked: false },
            { value: 'furniture', label: 'furniture', checked: false },
            { value: 'tops', label: 'tops', checked: false },
            { value: 'womens-dresses', label: 'womens dresses', checked: false },
            { value: 'womens-shoes', label: 'womens shoes', checked: false },
            { value: 'mens-shirts', label: 'mens shirts', checked: false },
            { value: 'mens-shoes', label: 'mens shoes', checked: false },
            { value: 'mens-watches', label: 'mens watches', checked: false },
            { value: 'womens-watches', label: 'womens watches', checked: false },
            { value: 'womens-bags', label: 'womens bags', checked: false },
            { value: 'womens-jewellery', label: 'womens jewellery', checked: false },
            { value: 'sunglasses', label: 'sunglasses', checked: false },
            { value: 'automotive', label: 'automotive', checked: false },
            { value: 'motorcycle', label: 'motorcycle', checked: false },
            { value: 'lighting', label: 'lighting', checked: false },
        ],
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const ProductList = () => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const products = useSelector(selectAllProducts)
    const totalItems = useSelector(selectTotalItems)
    // console.log("products",products)
    const dispatch = useDispatch()
    const [filter, setFilter] = useState({})
    const [sort, setSort] = useState({})
    const [page, setPage] = useState(1)
    useEffect(() => {
        const pagination = { _page: page, _per_page: ITEMS_PER_PAGE }
        // dispatch(fetchAllProductsAsync());
        dispatch(fetchProductsByFiltersAsync({ filter, sort, pagination }))
    }, [dispatch, filter, sort, page]);

    const handleFilter = (e, section, option) => {
        const newFilter = { ...filter };
        // TODO: on server we'll support multiple categories
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
        // console.log(newFilter)
        // console.log("handleFilter",section, option)
    }

    const handleSort = (option) => {
        const sort = { _sort: option.sort };
        setSort(sort);
        // console.log(sort)
        // console.log("handleSort", option)
    }

    const handlePage = (page) => {
        setPage(page);
    }

    useEffect(() => {
        setPage(1)
    }, [totalItems, sort])


    return (
        <>
            <div className="bg-white">
                <div>
                    {/* Mobile filter dialog */}
                    <MobileFilter handleFilter={handleFilter} mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen}></MobileFilter>

                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Products</h1>

                            <div className="flex items-center">
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                            Sort
                                            <ChevronDownIcon
                                                aria-hidden="true"
                                                className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                                            />
                                        </MenuButton>
                                    </div>

                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white ring-1 shadow-2xl ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                    >
                                        <div className="py-1">
                                            {sortOptions.map((option) => (
                                                <MenuItem key={option.name}>
                                                    <span
                                                        onClick={() => handleSort(option)}
                                                        className={classNames(
                                                            option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                            'block px-4 py-2 text-sm data-focus:bg-gray-100 data-focus:outline-hidden cursor-pointer',
                                                        )}
                                                    >
                                                        {option.name}
                                                    </span>
                                                </MenuItem>
                                            ))}
                                        </div>
                                    </MenuItems>
                                </Menu>

                                <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                    <span className="sr-only">View grid</span>
                                    <Squares2X2Icon aria-hidden="true" className="size-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
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
                                <DesktopFilter handleFilter={handleFilter}></DesktopFilter>


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


function MobileFilter({ handleFilter, mobileFiltersOpen, setMobileFiltersOpen }) {

    return (
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            />

            <div className="fixed inset-0 z-40 flex">
                <DialogPanel
                    transition
                    className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
                >
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(false)}
                            className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    {/* Filters */}
                    <form className="mt-4 border-t border-gray-200">

                        {filters.map((section) => (
                            <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                                <h3 className="-mx-2 -my-3 flow-root">
                                    <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                        <span className="font-medium text-gray-900">{section.name}</span>
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
                                                            defaultValue={option.value}
                                                            id={`filter-mobile-${section.id}-${optionIdx}`}
                                                            name={`${section.id}[]`}
                                                            type="checkbox"
                                                            onChange={(e) => handleFilter(e, section, option)}
                                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                        />
                                                        <svg
                                                            fill="none"
                                                            viewBox="0 0 14 14"
                                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
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
                                                    className="min-w-0 flex-1 text-gray-500"
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
function DesktopFilter({ handleFilter }) {
    return (
        <form className="hidden lg:block">

            {filters.map((section) => (
                <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
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
                                                defaultValue={option.value}
                                                defaultChecked={option.checked}
                                                id={`filter-${section.id}-${optionIdx}`}
                                                name={`${section.id}[]`}
                                                type="checkbox"
                                                onChange={(e) => handleFilter(e, section, option)}
                                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                            />
                                            <svg
                                                fill="none"
                                                viewBox="0 0 14 14"
                                                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
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
                                    <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
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
function Pagination({ handlePage, page, setPage, totalItems }) {
    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Previous
                </a>
                <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                        <span className="font-medium">{page * ITEMS_PER_PAGE > totalItems ? totalItems : page * ITEMS_PER_PAGE}</span> of{' '}
                        <span className="font-medium">{totalItems}</span> results
                    </p>
                </div>
                <div>
                    <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                    >
                        <a
                            href="#"
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </a>
                        {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                        {Array.from({ length: Math.ceil(totalItems / ITEMS_PER_PAGE) }).map((el, index) => {
                            return (
                                <div
                                    onClick={() => handlePage(index + 1)}
                                    aria-current="page"
                                    className={`relative cursor-pointer  z-10 inline-flex items-center ${page === index + 1 ? 'bg-indigo-600 text-white' : 'text-gray-400'}  px-4 py-2 text-sm font-semibold  focus:z-20 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                                >
                                    {index + 1}
                                </div>
                            )
                        })
                        }


                        <a
                            href="#"
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    )
}
function ProductGrid({ products }) {
    return (
        <div className="lg:col-span-3">

            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (
                            <Link to={`/product-details/${product.id}`}>
                                <div key={product.id} className="group relative">
                                    <img
                                        alt={product.imageAlt}
                                        src={product.images}
                                        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                    />
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <h3 className="text-sm text-gray-700">
                                                <a href={product.href}>
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.title}
                                                </a>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">{product.rating}</p>
                                            {/* <p className="mt-1 text-sm text-gray-500">{product.reviews.length}</p> */}
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{product.price}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

