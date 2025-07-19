import React, { useEffect, useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, ShoppingCartIcon, XMarkIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { selectItems } from '../cart/CartSlice'
import { selectIsFetchingLoggedInUser, selectUserInfo } from '../user/userSlice'
import toast, { Toaster } from 'react-hot-toast'
import Footer from '../common/Footer'

const userNavigation = [
    { name: 'Home', link: '/' },
    { name: 'My Orders', link: '/orders' },
    { name: 'My Profile', link: '/profile' },
]

const adminNavigation = [
    { name: 'Home', link: '/' },
    { name: 'My Orders', link: '/orders' },
    { name: 'Orders', link: '/admin/orders' },
    { name: 'My Profile', link: '/profile' },
]

function setThemeClass(theme) {
    if (theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

export default function Navbar({ children }) {

    const items = useSelector(selectItems);
    const getUser = useSelector(selectUserInfo);
    const isFetchingLoggedInUser = useSelector(selectIsFetchingLoggedInUser);

    const [theme, setTheme] = useState(() => {
        if ("theme" in localStorage) return localStorage.theme;
        return "dark";
    });

    useEffect(() => {
        setThemeClass(theme);
    }, [theme]);

    const handleThemeToggle = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        localStorage.theme = nextTheme;
    };

    return (
        <>
            <div className="min-h-screen">
                <Disclosure as="nav" className="bg-gray-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <div className="flex items-center shrink-0 cursor-pointer">
                                    <img
                                        alt="img"
                                        src="/buyhive.png"
                                        className="size-8"
                                    />
                                    <span className='text-white font-bold'>
                                        buyhive
                                    </span>
                                </div>
                                {/* Dark mode toggle for mobile */}
                                <div className="flex md:hidden items-center gap-2 px-5">
                                    <button
                                        type="button"
                                        aria-label="Toggle dark mode"
                                        onClick={handleThemeToggle}
                                        className="rounded-full bg-gray-700 cursor-pointer p-2 text-gray-300 hover:bg-gray-600 hover:text-white transition"
                                    >
                                        {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
                                    </button>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        {getUser?.role !== 'admin' ? userNavigation.map((item) => (
                                            <NavLink
                                                key={item.name}
                                                to={item.link}
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
                                    {/* Dark mode toggle button */}
                                    <div className="flex items-center gap-2 mr-2">
                                        <button
                                            type="button"
                                            aria-label="Toggle dark mode"
                                            onClick={handleThemeToggle}
                                            className="rounded-full bg-gray-700 cursor-pointer p-2 text-gray-300 hover:bg-gray-600 hover:text-white transition"
                                        >
                                            {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
                                        </button>
                                    </div>
                                    {isFetchingLoggedInUser ? (
                                        <div className="flex items-center gap-2 animate-pulse">
                                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                                        </div>
                                    ) : getUser ?
                                        <>
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
                                            <Menu as="div" className="relative ml-3">
                                                <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                                    <span className="absolute -inset-1.5" />
                                                    <span className="sr-only">Open user menu</span>
                                                    {/* TODO */}
                                                    {/* <img alt="img" src={user.imageUrl} className="size-8 rounded-full z-0 cursor-pointer" /> */}
                                                    <div className='w-8 h-8 rounded-full text-xl text-center font-medium bg-indigo-200 cursor-pointer z-0'>{getUser.name?.split('')[0]}</div>
                                                </MenuButton>
                                               <MenuItems
                                                        transition
                                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                                    >
                                                        <MenuItem>
                                                            <Link to={'/profile'} className='flex flex-col px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-700'>
                                                                <div className="text-base/5 font-medium text-gray-800 dark:text-white">{getUser.name}</div>
                                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-300">{getUser.email}</div>
                                                            </Link>
                                                        </MenuItem>
                                                    </MenuItems>
                                            </Menu>
                                        </>
                                        :
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
                        <div className="border-t border-gray-700 pt-4 pb-3">
                            {isFetchingLoggedInUser ? (
                                <div className="flex items-center gap-2 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                                </div>
                            ) : getUser ?
                                <div className="flex items-center px-5">
                                    <Link to={'/profile'} className='flex items-center'>
                                        <div className="shrink-0">
                                            {/* TODO */}
                                            {/* <img alt="" src={user.imageUrl} className="size-10 rounded-full" /> */}
                                            <div className='w-10 h-10 z-0 rounded-full bg-indigo-200 text-3xl font-medium cursor-pointer text-center'>{getUser.name?.split('')[0]}</div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base/5 font-medium text-white">{getUser.name}</div>
                                            <div className="text-sm font-medium text-gray-400">{getUser.email}</div>
                                        </div>
                                    </Link>
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

                                </div> :
                                <Link
                                    to="/auth"
                                    className="ml-4 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                                >
                                    Log in
                                </Link>
                            }
                            <div className="mt-3 space-y-1 px-2">
                                {userNavigation.map((item) => (
                                    <DisclosureButton
                                        key={item.name}
                                        as="a"
                                        href={item.link}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                ))}
                            </div>
                        </div>
                    </DisclosurePanel>
                </Disclosure>

                <main className='dark:bg-gray-700'>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
                <Footer />
            </div>
            <Toaster />
        </>
    )
}
