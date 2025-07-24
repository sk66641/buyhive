import { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByIdAsync, selectedProductById, selectErrorFetchingProductById, selectIsFetchingProductById } from '../productSlice'
import { Link, useParams } from 'react-router-dom'
import { addToCartAsync, resetCartErrors, selectErrorAddingToCart, selectIsAddingToCart, selectItems } from '../../cart/CartSlice'
import { selectUserInfo } from '../../user/userSlice'
import toast, { Toaster } from 'react-hot-toast'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetails() {
  const dispatch = useDispatch();
  const params = useParams();

  const [selectedColor, setSelectedColor] = useState()
  const [selectedSize, setSelectedSize] = useState()


  const isFetchingProductById = useSelector(selectIsFetchingProductById);
  const ErrorFetchingProductById = useSelector(selectErrorFetchingProductById);
  const isAddingToCart = useSelector(selectIsAddingToCart);
  const ErrorAddingToCart = useSelector(selectErrorAddingToCart);

  const user = useSelector(selectUserInfo);
  const cartItems = useSelector(selectItems);
  const product = useSelector(selectedProductById);

  const isAddedToCart = cartItems.some(item => item.product.id === params.id);

  useEffect(() => {
    dispatch(fetchProductsByIdAsync(params.id));
  }, [dispatch, params.id])

  const handleCart = (e) => {
    e.preventDefault();
    const item = { product: product.id, quantity: 1, user: user.id };

    if (selectedColor) {
      item.color = selectedColor;
    }
    if (selectedSize) {
      item.size = selectedSize;
    }

    const userId = user.id;
    dispatch(addToCartAsync({ item, userId })).unwrap().then(() => toast.success("Item added to cart"));
  }

  useEffect(() => {
    if (ErrorFetchingProductById) {
      toast.error(ErrorFetchingProductById);
    }
    if (ErrorAddingToCart) {
      toast.error(ErrorAddingToCart);
    }
    dispatch(resetCartErrors());
  }, [ErrorAddingToCart, ErrorFetchingProductById, dispatch]);

  return (
    <>
      {isFetchingProductById ?
        <div className="bg-white dark:bg-gray-900 rounded-2xl min-h-screen flex items-start justify-center">
          {/* Shimmer effect for loading - matches product details layout */}
          <div className="mx-auto mt-10 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8 w-full animate-pulse">
            {/* Image gallery shimmer */}
            <div className="hidden lg:block">
              <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-6" />
            </div>
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              <div className="h-40 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
              <div className="h-40 w-full bg-gray-100 dark:bg-gray-600 rounded-lg" />
            </div>
            <div className="h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-lg lg:aspect-auto" />
            {/* Product info shimmer */}
            <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:col-span-3 lg:row-span-2 lg:gap-x-8 lg:px-8 lg:pt-0 lg:pb-0 flex flex-col gap-6 mt-8 lg:mt-0">
              <div className="h-8 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="flex items-center gap-3 mb-4">
                <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-6 w-16 bg-gray-100 dark:bg-gray-600 rounded" />
                <div className="h-5 w-16 bg-green-100 dark:bg-green-900 rounded" />
              </div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-5 w-5 bg-yellow-100 dark:bg-yellow-900 rounded" />
                ))}
                <div className="h-4 w-16 bg-gray-100 dark:bg-gray-600 rounded ml-2" />
              </div>
              <div className="h-10 w-1/2 bg-gray-100 dark:bg-gray-600 rounded mt-4" />
              <div className="h-10 w-1/3 bg-gray-100 dark:bg-gray-600 rounded mt-2" />
              <div className="h-12 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mt-6" />
            </div>
          </div>
        </div>
        :
        <div className="bg-white rounded-2xl dark:bg-gray-900">
          {product &&
            <div className="pt-6">
              <nav aria-label="Breadcrumb">
                <ol role="list" className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                  {product.breadcrumbs && product.breadcrumbs.map((breadcrumb) => (
                    <li key={breadcrumb.id}>
                      <div className="flex items-center">
                        <a href={breadcrumb.href} className="mr-2 text-sm font-medium text-gray-900 dark:text-white">
                          {breadcrumb.name}
                        </a>
                        <svg
                          fill="currentColor"
                          width={16}
                          height={20}
                          viewBox="0 0 16 20"
                          aria-hidden="true"
                          className="h-5 w-4 text-gray-300 dark:text-gray-600"
                        >
                          <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                        </svg>
                      </div>
                    </li>
                  ))}
                  <li className="text-sm">
                    <a href={product.href} aria-current="page" className="font-medium text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      {product.title}
                    </a>
                  </li>
                </ol>
              </nav>

              {/* Image gallery */}
              <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                <img
                  alt={product.title}
                  src={product.images[0] || product.thumbnail}
                  className="hidden size-full rounded-lg object-cover lg:block"
                />
                <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                  <img
                    alt={product.title}
                    src={product.images[1] || product.thumbnail}
                    className="aspect-3/2 w-full rounded-lg object-cover"
                  />
                  <img
                    alt={product.title}
                    src={product.images[2] || product.thumbnail}
                    className="aspect-3/2 w-full rounded-lg object-cover"
                  />
                </div>
                <img
                  alt={product.title}
                  src={product.images[3] || product.thumbnail}
                  className="aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-auto"
                />
              </div>

              {/* Product info */}
              <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                <div className="lg:col-span-2 lg:border-r lg:border-gray-200 dark:lg:border-gray-700 lg:pr-8">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">{product.name}</h1>
                </div>

                {/* Options */}
                <div className="mt-4 lg:row-span-3 lg:mt-0">
                  <h2 className="sr-only">Product information</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">${product.discountedPrice}</span>
                    <span className="text-lg text-gray-400 dark:text-gray-500 line-through">${product.price}</span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-2 py-0.5 rounded-lg">
                      {product.discountPercentage}% OFF
                    </span>
                  </div>

                  {/* Reviews */}
                  <div className="mt-6">
                    <h3 className="sr-only">Reviews</h3>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            aria-hidden="true"
                            className={classNames(
                              product.rating > rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600',
                              'size-5 shrink-0',
                            )}
                          />
                        ))}
                      </div>
                      <p className="ml-2 text-sm text-gray-900 dark:text-white">{product.rating} out of 5 stars</p>
                      {/* <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a> */}
                    </div>
                  </div>

                  <form className="mt-6">
                    {/* Colors */}
                    {product.colors.length > 0 &&
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Color</h3>

                        <fieldset aria-label="Choose a color" className="mt-4">
                          <RadioGroup value={selectedColor} onChange={setSelectedColor} className="flex items-center gap-x-3">
                            {product.colors.map((color) => (
                              <Radio
                                key={color.name}
                                value={color}
                                aria-label={color.name}
                                className={classNames(
                                  color.selectedClass,
                                  'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-hidden data-checked:ring-2 data-focus:data-checked:ring-3 data-focus:data-checked:ring-offset-1',
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className={classNames(color.class, 'size-8 rounded-full border border-black/10 dark:border-white/20')}
                                />
                              </Radio>
                            ))}
                          </RadioGroup>
                        </fieldset>
                      </div>}

                    {/* Sizes */}
                    {product.sizes.length > 0 &&
                      <div className="mt-10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Size</h3>
                          <a href="#" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                            Size guide
                          </a>
                        </div>

                        <fieldset aria-label="Choose a size" className="mt-4">
                          <RadioGroup
                            value={selectedSize}
                            onChange={setSelectedSize}
                            className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                          >
                            {product.sizes.map((size) => (
                              <Radio
                                key={size.name}
                                value={size}
                                disabled={!size.inStock}
                                className={classNames(
                                  size.inStock
                                    ? 'cursor-pointer bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xs'
                                    : 'cursor-not-allowed bg-gray-50 dark:bg-gray-700 text-gray-200 dark:text-gray-500',
                                  'group relative flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-medium uppercase hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-hidden data-focus:ring-2 data-focus:ring-indigo-500 sm:flex-1 sm:py-6',
                                )}
                              >
                                <span>{size.name}</span>
                                {size.inStock ? (
                                  <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -inset-px rounded-md border-2 border-transparent group-data-checked:border-indigo-500 group-data-focus:border"
                                  />
                                ) : (
                                  <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200 dark:border-gray-600"
                                  >
                                    <svg
                                      stroke="currentColor"
                                      viewBox="0 0 100 100"
                                      preserveAspectRatio="none"
                                      className="absolute inset-0 size-full stroke-2 text-gray-200 dark:text-gray-600"
                                    >
                                      <line x1={0} x2={100} y1={100} y2={0} vectorEffect="non-scaling-stroke" />
                                    </svg>
                                  </span>
                                )}
                              </Radio>
                            ))}
                          </RadioGroup>
                        </fieldset>
                      </div>}

                    <button
                      onClick={handleCart}
                      disabled={product.deleted || !(product.stock > 0) || isAddedToCart || isAddingToCart}
                      type="submit"
                      className={`mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-700 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden ${product.deleted || !(product.stock > 0) || isAddedToCart || isAddingToCart ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                    >
                      {isAddingToCart ? "Adding to Cart..." : product.deleted ? "Deleted" : product.stock > 0 ? isAddedToCart ? "Added to Cart" : "Add to Cart" : "Out of Stock"}
                    </button>
                  </form>
                </div>

                <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 dark:lg:border-gray-700 lg:pt-6 lg:pr-8 lg:pb-16">
                  {/* Description and details */}
                  <div>
                    <h3 className="sr-only">Description</h3>

                    <div className="space-y-6">
                      <p className="text-base text-gray-900 dark:text-white">{product.description}</p>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Highlights</h3>

                    <div className="mt-4">
                      <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                        {product.highlights.map((highlight) => (
                          <li key={highlight} className="text-gray-400 dark:text-gray-500">
                            <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-sm font-medium text-gray-900 dark:text-white">Details</h2>

                    <div className="mt-4 space-y-6">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{product.details}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>}
      <Toaster />
    </>
  )
}
