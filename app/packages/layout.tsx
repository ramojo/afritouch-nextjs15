import React from 'react';

const PackageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="layout-container">
            {/* <header className="header">
                <h1 className="text-3xl font-bold">Meal Packages</h1>
            </header> */}
            <main className="main-content" suppressHydrationWarning>
                {children}
            </main>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Afritouch Caterers. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PackageLayout;