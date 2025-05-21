export function PublicFooter() {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold">NewsAdmin</span>
              </div>
              <p className="text-gray-400">
                The ultimate news management platform for modern publishers. Create, manage, and publish your content with ease.
              </p>
            </div>
  
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/sign-up" className="text-gray-400 hover:text-white transition-colors">Get Started</a></li>
              </ul>
            </div>
  
            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-400">Content Management</span></li>
                <li><span className="text-gray-400">User Management</span></li>
                <li><span className="text-gray-400">Analytics</span></li>
                <li><span className="text-gray-400">Categories</span></li>
              </ul>
            </div>
  
            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">support@newsadmin.pro</li>
                <li className="text-gray-400">+358 123 456 789</li>
                <li className="text-gray-400">Helsinki, Finland</li>
              </ul>
            </div>
          </div>
  
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 NewsAdmin Pro. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Privacy Policy</span>
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Terms of Service</span>
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }