import { FaGlobe } from 'react-icons/fa'; // Import the globe icon from FontAwesome

export default function Header({ currentLanguage, setLanguage })
{
    return (
        <header className="sticky top-0 z-10 bg-gradient-to-r from-red-500 to-orange-500 shadow-xl backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo Section */}
                <div className="flex items-center space-x-3">
                    <div className="relative flex items-center justify-center bg-white rounded-full p-1 shadow-lg">
                        <img
                            src="/santa.png" // Replace with the actual path to your logo
                            alt="Secret Santa Logo"
                            className="h-12 w-12"
                        />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
                        {currentLanguage?.title || 'Secret Santa'}
                    </h1>
                </div>

                {/* Language Selector */}
                <div className="flex items-center space-x-4">
                    <p className="text-sm font-medium text-white hidden sm:block">
                        {currentLanguage?.languageLabel}
                    </p>
                    <div className="relative">
                        <select
                            className="p-2 pl-10 pr-4 bg-opacity-80 bg-white text-gray-700 border-none rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 hover:ring-orange-300 transition-all"
                            onChange={(e) => setLanguage(e.target.value)}
                            defaultValue="ro"
                        >
                            <option value="ro">Română</option>
                            <option value="en">English</option>
                            <option value="de">Deutsch</option>
                        </select>
                        {/* Icon next to the dropdown */}
                        <FaGlobe className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-700" />
                    </div>
                </div>
            </div>
        </header>
    );
}
