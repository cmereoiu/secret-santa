'use client'; // Indicates this is a client-side component in a React framework like Next.js

import { useState, useEffect } from 'react'; // Import React hooks for managing state and side effects
import Header from '../../components/header'; // Header component
import Footer from '../../components/footer'; // Footer component
import translations from '../../lib/translations'; // Translations for multilingual support
import { FaPlus, FaTrashAlt, FaUsers, FaUserEdit, FaChevronDown, FaChevronRight, FaInfoCircle, FaTimes } from 'react-icons/fa'; // FontAwesome icons for UI

// Main Admin component
export default function Admin() {
    // State variables
    const [name, setName] = useState(''); // Stores user name input
    const [email, setEmail] = useState(''); // Stores user email input
    const [users, setUsers] = useState([]); // Stores list of users
    const [userCount, setUserCount] = useState(0); // Stores total user count
    const [infoMessage, setInfoMessage] = useState(''); // Stores informational or error messages
    const [language, setLanguage] = useState('ro'); // Stores selected language ('ro' as default)
    const [customMessage, setCustomMessage] = useState(''); // Custom message for pairings
    const [isAdminInfoCollapsed, setIsAdminInfoCollapsed] = useState(false); // Toggle for admin info section

    // Get current language translations or fallback to default ('ro')
    const currentLanguage = translations[language] || translations.ro;

    // Toggles the visibility of the admin information section
    const toggleAdminInfo = () => {
        setIsAdminInfoCollapsed((prev) => !prev);
    };

    // Fetches users and user count from the server on component mount or state changes
    useEffect(() => {
        const fetchUsersAndCount = async () => {
            // Fetch the list of users
            const res = await fetch('/api/getUsers');
            const data = await res.json();
            setUsers(data.users);

            // Fetch the total user count
            const countRes = await fetch('/api/getUserCount');
            const countData = await countRes.json();
            setUserCount(countData.count);

            // Update the informational message based on user count
            setInfoMessage(
                countData.count > 0
                    ? currentLanguage.infoMessage.replace('{count}', countData.count)
                    : currentLanguage.noUsersMessage
            );
        };

        fetchUsersAndCount(); // Execute the fetch function
    }, [language, customMessage, currentLanguage.infoMessage, currentLanguage.noUsersMessage]);

    // Adds a new user to the system
    const handleAddUser = async () => {
        // Validate name and email inputs
        if (!name || !email) {
            setInfoMessage(currentLanguage.validation.nameEmailRequired);
            return;
        }

        const nameRegex = /^[a-zA-Z\s]{3,50}$/; // Validate name format
        if (!nameRegex.test(name)) {
            setInfoMessage(currentLanguage.validation.invalidName);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validate email format
        if (!emailRegex.test(email)) {
            setInfoMessage(currentLanguage.validation.invalidEmail);
            return;
        }

        // Send request to add a new user
        const res = await fetch('/api/addUser', {
            method: 'POST',
            body: JSON.stringify({ name, email }),
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (data.user) {
            // Update state with the new user
            setUsers((prev) => [...prev, data.user]);
            setName(''); // Reset name input
            setEmail(''); // Reset email input

            // Fetch updated user count
            const countRes = await fetch('/api/getUserCount');
            const countData = await countRes.json();
            setUserCount(countData.count);

            // Update the informational message
            setInfoMessage(
                countData.count > 0
                    ? currentLanguage.infoMessage.replace('{count}', countData.count)
                    : currentLanguage.noUsersMessage
            );
        } else {
            setInfoMessage(currentLanguage.error.addUserError); // Show error message on failure
        }
    };

    // Generates pairings using the custom message and selected language
    const handleGeneratePairings = async () => {
        const res = await fetch('/api/generatePairings', {
            method: 'POST',
            body: JSON.stringify({ customMessage, language }),
            headers: { 'Content-Type': 'application/json' },
        });

        // Update the informational message based on success or failure
        setInfoMessage(
            res.ok
                ? currentLanguage.success.pairingsGenerated
                : currentLanguage.error.pairingsError
        );
    };

    // Deletes all users from the system
    const handleDeleteAllUsers = async () => {
        const res = await fetch('/api/deleteUsers', { method: 'POST' });
        const data = await res.json();

        if (data.message === 'All users deleted successfully!') {
            setUsers([]); // Clear user list
            setUserCount(0); // Reset user count
            setInfoMessage(currentLanguage.success.usersDeleted); // Success message
        } else {
            setInfoMessage(currentLanguage.error.deleteUsersError); // Error message
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-400 to-white">
            {/* Render the Header */}
            <Header currentLanguage={currentLanguage.header} setLanguage={setLanguage} />
            <main className="container mx-auto px-6 py-8">
                {/* Display informational message */}
                {infoMessage && (
                    <div className="relative p-4 mb-6 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg shadow-md flex items-center">
                        <FaInfoCircle className="text-yellow-500 text-2xl mr-3" />
                        <span className="flex-grow">{infoMessage}</span>
                        <button
                            onClick={() => setInfoMessage('')}
                            className="text-yellow-500 hover:text-yellow-700 focus:outline-none"
                        >
                            <FaTimes className="text-xl" />
                        </button>
                    </div>
                )}


                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Admin Info Section */}
                    <section className="p-8 bg-white shadow-lg rounded-lg bg-opacity-90 backdrop-blur-sm">
                        <div
                            className="flex items-center justify-between cursor-pointer border-b pb-2"
                            onClick={toggleAdminInfo}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <FaUsers className="mr-2" />
                                {currentLanguage.adminInfo.title || "Admin Information"}
                            </h2>
                            {isAdminInfoCollapsed ? (
                                <FaChevronRight className="text-gray-500 text-lg" />
                            ) : (
                                <FaChevronDown className="text-gray-500 text-lg" />
                            )}
                        </div>
                        {!isAdminInfoCollapsed && (
                            <ul className="mt-4 list-disc list-inside space-y-2">
                                {[
                                    currentLanguage.adminInfo.step1,
                                    currentLanguage.adminInfo.step2,
                                    currentLanguage.adminInfo.step3,
                                    currentLanguage.adminInfo.step4,
                                    currentLanguage.adminInfo.step5,
                                    currentLanguage.adminInfo.step6,
                                ].map((step, idx) => (
                                    <li key={idx} className="text-gray-700">{step}</li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* User Form Section */}
                    <section className="lg:col-span-2 p-8 bg-white shadow-lg rounded-lg bg-opacity-90 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FaUserEdit className="mr-2" />
                            {currentLanguage.title}
                        </h2>
                        <form className="mt-6 space-y-4">
                            {/* Input fields for name and email */}
                            <input
                                type="text"
                                placeholder={currentLanguage.userNamePlaceholder}
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="email"
                                placeholder={currentLanguage.emailPlaceholder}
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* Add User Button */}
                            <button
                                type="button"
                                onClick={handleAddUser}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all flex items-center"
                            >
                                <FaPlus className="mr-2" />
                                {currentLanguage.addUserButton}
                            </button>

                            {/* Input for custom pairing message */}
                            <textarea
                                placeholder={currentLanguage.customMessagePlaceholder}
                                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                rows="4"
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                            />

                            {/* Generate Pairings Button */}
                            <button
                                type="button"
                                onClick={handleGeneratePairings}
                                className={`px-4 py-2 rounded-lg shadow-md flex items-center transition-all ${
                                    userCount >= 4
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                }`}
                                disabled={userCount < 4} // Disable button if less than 4 users
                            >
                                <FaUsers className="mr-2" />
                                {currentLanguage.generatePairingsButton}
                            </button>
                        </form>
                    </section>
                </div>

                {/* User List Section */}
                {userCount > 0 && (
                    <>
                        <section className="mt-8 p-8 bg-white shadow-lg rounded-lg bg-opacity-90 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                <FaUsers className="mr-2" />
                                {currentLanguage.usersListTitle}
                            </h2>
                            <ul className="mt-4 space-y-2">
                                {users.map((user) => (
                                    <li
                                        key={user.id}
                                        className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow"
                                    >
                                        <span className="font-medium text-gray-800">{user.name}</span>
                                        <span className="text-gray-600">({user.email})</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Delete All Users Button */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={handleDeleteAllUsers}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all flex items-center justify-center"
                            >
                                <FaTrashAlt className="mr-2" />
                                {currentLanguage.deleteUsersButton}
                            </button>
                        </div>
                    </>
                )}
            </main>
            {/* Render the Footer */}
            <Footer />
        </div>
    );
}
