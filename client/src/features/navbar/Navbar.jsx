import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { selectItems } from '../cart/CartSlice'
import { selectIsFetchingLoggedInUser, selectUserInfo } from '../user/userSlice'
import { selectErrorSigningOut, selectIsSigningOut, signOutAsync } from '../auth/authSlice'
import toast, { Toaster } from 'react-hot-toast'

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
    { name: 'Home', href: '/', current: true },
    { name: 'My Profile', href: '/profile', current: false },
    { name: 'Orders', href: '/orders', current: false },
]
const userNavigation = [
    { name: 'My Profile', link: '/profile' },
    { name: 'My Orders', link: '/orders' },
]

const adminNavigation = [
    { name: 'Home', link: '/' },
    { name: 'My Profile', link: '/profile' },
    { name: 'My Orders', link: '/orders' },
    { name: 'Orders', link: '/admin/orders' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar({ children }) {

    const dispatch = useDispatch();
    const items = useSelector(selectItems);
    const getUser = useSelector(selectUserInfo);
    const isSigningOut = useSelector(selectIsSigningOut);
    const ErrorSigningOut = useSelector(selectErrorSigningOut);

    const handleSignOut = () => {
        dispatch(signOutAsync()).
            unwrap().then(() => {
                window.location.replace('/');
            })
            .catch((err) => {
                console.error('Sign out failed:', err);
            });
    }

    if (ErrorSigningOut) {
        toast.error(ErrorSigningOut);
        // dispatch(resetAuthErrors());
    }

    return (
        <>
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="shrink-0">
                                    <img
                                        alt="buyhive"
                                        src="buyhive.png"
                                        className="size-8"
                                    />
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        {getUser?.role !== 'admin' ? navigation.map((item) => (
                                            <NavLink
                                                key={item.name}
                                                to={item.href}
                                                className={({ isActive }) =>
                                                    `rounded-md px-3 py-2 text-sm font-medium ${isActive
                                                        ? 'bg-gray-900 text-white'
                                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                    }`
                                                }
                                            >
                                                {item.name}
                                            </NavLink>
                                        )) :
                                            adminNavigation.map((item) => (
                                                <NavLink
                                                    end
                                                    className={({ isActive }) =>
                                                        `rounded-md px-3 py-2 text-sm font-medium ${isActive
                                                            ? 'bg-gray-900 text-white'
                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        }`
                                                    }
                                                    key={item.name} to={item.link}>{item.name}

                                                </NavLink>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    <Link to={'/cart'}
                                        type="button"
                                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                    >
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <ShoppingCartIcon aria-hidden="true" className="size-6" />
                                    </Link>
                                    {items.length > 0 && <span className="mb-5 -ml-3 z-0 inline-flex items-center rounded-md bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                                        {items.length}
                                    </span>}

                                    {/* Profile dropdown */}
                                    {getUser ?
                                        <Menu as="div" className="relative ml-3">
                                            <div>
                                                <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                                    <span className="absolute -inset-1.5" />
                                                    <span className="sr-only">Open user menu</span>
                                                    <img alt="img" src={user.imageUrl} className="size-8 rounded-full z-0 cursor-pointer" />
                                                </MenuButton>
                                            </div>
                                            <MenuItems
                                                transition
                                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                            >
                                                {userNavigation.map((item) => (
                                                    <MenuItem key={item.name}>
                                                        <Link
                                                            to={item.link}
                                                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </MenuItem>
                                                ))}
                                                <MenuItem>
                                                    <button disabled={isSigningOut} type='button' onClick={handleSignOut}
                                                        className={`block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden text-left cursor-pointer w-full ${isSigningOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        {isSigningOut ? 'Signing out...' : 'Sign out'}
                                                    </button>
                                                </MenuItem>
                                            </MenuItems>
                                        </Menu> :
                                        <Link
                                            to="/auth"
                                            className="ml-4 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                                        >
                                            Log in
                                        </Link>}
                                </div>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                {/* Mobile menu button */}
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="md:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                            {navigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                        'block rounded-md px-3 py-2 text-base font-medium',
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                        <div className="border-t border-gray-700 pt-4 pb-3">
                            <div className="flex items-center px-5">
                                <div className="shrink-0">
                                    <img alt="" src={user.imageUrl} className="size-10 rounded-full" />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base/5 font-medium text-white">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-400">{user.email}</div>
                                </div>
                                <Link to={'/cart'}
                                    type="button"
                                    className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                                >
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <ShoppingCartIcon aria-hidden="true" className="size-6" />
                                </Link>
                                {items.length > 0 && <span className="inline-flex items-center rounded-md bg-gray-50 mb-5 -ml-3 px-1.5 py-0.5 z-0 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
                                    {items.length}
                                </span>}

                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                {userNavigation.map((item) => (
                                    <DisclosureButton
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                ))}
                            </div>
                        </div>
                    </DisclosurePanel>
                </Disclosure>

                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster />
        </>
    )
}
