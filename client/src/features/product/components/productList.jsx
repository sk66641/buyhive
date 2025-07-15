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
import Pagination from '../../common/Pagination'

const sortOptions = [
    // { name: 'Most Popular', sort: 'reviews.length', current: true },
    { name: 'Best Rating', sort: '-rating', current: false },
    { name: 'Price: Low to High', sort: 'price', current: false },
    { name: 'Price: High to Low', sort: '-price', current: false },
]

// TODO: add discount and discounted price, also add sorting by discounted price
export const filters =
    [
        {
            "id": "brand",
            "name": "Brands",
            "options": [
                { "value": "Essence", "label": "Essence", "checked": false },
                { "value": "Glamour Beauty", "label": "Glamour Beauty", "checked": false },
                { "value": "Velvet Touch", "label": "Velvet Touch", "checked": false },
                { "value": "Chic Cosmetics", "label": "Chic Cosmetics", "checked": false },
                { "value": "Nail Couture", "label": "Nail Couture", "checked": false },
                { "value": "Calvin Klein", "label": "Calvin Klein", "checked": false },
                { "value": "Chanel", "label": "Chanel", "checked": false },
                { "value": "Dior", "label": "Dior", "checked": false },
                { "value": "Dolce & Gabbana", "label": "Dolce & Gabbana", "checked": false },
                { "value": "Gucci", "label": "Gucci", "checked": false },
                { "value": "Annibale Colombo", "label": "Annibale Colombo", "checked": false },
                { "value": "Furniture Co.", "label": "Furniture Co.", "checked": false },
                { "value": "Knoll", "label": "Knoll", "checked": false },
                { "value": "Bath Trends", "label": "Bath Trends", "checked": false },
                { "value": "Apple", "label": "Apple", "checked": false },
                { "value": "Asus", "label": "Asus", "checked": false },
                { "value": "Huawei", "label": "Huawei", "checked": false },
                { "value": "Lenovo", "label": "Lenovo", "checked": false },
                { "value": "Dell", "label": "Dell", "checked": false },
                { "value": "Fashion Trends", "label": "Fashion Trends", "checked": false },
                { "value": "Gigabyte", "label": "Gigabyte", "checked": false },
                { "value": "Classic Wear", "label": "Classic Wear", "checked": false },
                { "value": "Casual Comfort", "label": "Casual Comfort", "checked": false },
                { "value": "Urban Chic", "label": "Urban Chic", "checked": false },
                { "value": "Nike", "label": "Nike", "checked": false },
                { "value": "Puma", "label": "Puma", "checked": false },
                { "value": "Off White", "label": "Off White", "checked": false },
                { "value": "Fashion Timepieces", "label": "Fashion Timepieces", "checked": false },
                { "value": "Longines", "label": "Longines", "checked": false },
                { "value": "Rolex", "label": "Rolex", "checked": false },
                { "value": "Amazon", "label": "Amazon", "checked": false },
                { "value": "Al Munakh", "label": "Al Munakh", "checked": false }
            ]
        },
        {
            "id": "category",
            "name": "Category",
            "options": [
                { "value": "beauty", "label": "Beauty", "checked": false },
                { "value": "fragrances", "label": "Fragrances", "checked": false },
                { "value": "furniture", "label": "Furniture", "checked": false },
                { "value": "groceries", "label": "Groceries", "checked": false },
                { "value": "home-decoration", "label": "Home-decoration", "checked": false },
                { "value": "kitchen-accessories", "label": "Kitchen-accessories", "checked": false },
                { "value": "laptops", "label": "Laptops", "checked": false },
                { "value": "mens-shirts", "label": "Mens-shirts", "checked": false },
                { "value": "mens-shoes", "label": "Mens-shoes", "checked": false },
                { "value": "mens-watches", "label": "Mens-watches", "checked": false },
                { "value": "mobile-accessories", "label": "Mobile-accessories", "checked": false },
                { "value": "womens-shoes", "label": "Womens-shoes", "checked": false }
            ]
        }
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

function ProductGrid({ products }) {
    return (
        <div className="lg:col-span-3">

            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (
                            <Link key={product.id} className='border rounded-md p-2 h-full' to={`/product-details/${product.id}`}>
                                <div className="group relative">
                                    <img
                                        alt={product.imageAlt}
                                        src={product.images}
                                        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                    />
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <h3 className="text-sm">
                                                {product.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">{product.rating}</p>
                                            {/* <p className="mt-1 text-sm text-gray-500">{product.reviews.length}</p> */}
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{product.price}</p>
                                    </div>
                                    {product.deleted && <p className='text-red-500'>Product is deleted</p>}
                                    {product.stock === 0 && <p className='text-red-500'>Product out of stock</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

