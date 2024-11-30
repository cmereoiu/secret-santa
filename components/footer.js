export default function Footer()
{
    return (
        <footer className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-8 shadow-xl backdrop-blur-md">
            <div className="max-w-7xl mx-auto text-center">
                {/* Footer Text */}
                <p className="text-sm md:text-base font-medium">
                    © {new Date().getFullYear()} <span className="font-bold">Secret Santa v1.0</span>
                    <span> 🎅 Made with <span role="img" aria-label="heart">❤️</span> by CM</span>
                </p>

                {/* Version Note */}
                <p className="mt-4 text-xs">
                    <em>{`Version 1.0 • Holiday Edition`}</em>
                </p>
            </div>
        </footer>
    );
}
