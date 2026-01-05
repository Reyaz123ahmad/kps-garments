


import React from 'react';
import pic from '../assets/Ejaz.jpg'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            About <span className="text-blue-600">KPS</span> Garments
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Company Image */}
          <div className="relative flex justify-center">
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
              <img 
                src="https://copilot.microsoft.com/th/id/BCO.ff7d0852-0f67-4f32-bcd8-e7bc089ba45e.png"
                alt="KPS Garments Manufacturing"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Right Column - Company Description */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Crafting Excellence in Every Thread
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              At <span className="font-semibold text-blue-600">KPS Garments</span>, we stand as a beacon of quality and innovation in the apparel industry. 
              With decades of expertise, we've mastered the art of blending traditional craftsmanship 
              with contemporary design sensibilities.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              Our commitment extends beyond creating clothing – we curate experiences that reflect 
              individuality while maintaining the highest standards of comfort and durability.
            </p>
          </div>
        </div>

        {/* Owner Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16 border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Owner Photo */}
            <div className="flex flex-col items-center">
              <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg mb-6">
                <img 
                  src={pic} 
                  alt="Owner - KPS Garments"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center bg-blue-50 px-6 py-4 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800">Mr. Ejaz Ahmad</h3>
                <p className="text-blue-600 font-semibold">Founder & CEO</p>
              </div>
            </div>

            {/* Vision & Mission Box */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vision */}
                <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To revolutionize the garment industry by setting unparalleled standards in quality, 
                    sustainability, and customer satisfaction while preserving traditional craftsmanship.
                  </p>
                </div>

                {/* Mission */}
                <div className="space-y-4 bg-green-50 p-6 rounded-lg border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To deliver exceptional apparel that combines comfort, style, and durability, 
                    while fostering sustainable practices and creating value for our customers 
                    and community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Quality */}
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-red-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Quality</h3>
            <p className="text-gray-600">
              Uncompromising quality standards with meticulous attention to detail in every stitch.
            </p>
          </div>

          {/* Innovation */}
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-purple-500">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Innovation</h3>
            <p className="text-gray-600">
              Constantly evolving with fashion trends while maintaining timeless elegance.
            </p>
          </div>

          {/* Sustainability */}
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-green-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Sustainability</h3>
            <p className="text-gray-600">
              Eco-friendly practices and sustainable materials for a better tomorrow.
            </p>
          </div>
        </div>

        {/* Additional Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Where Tradition Meets Trend</h3>
          <p className="text-lg max-w-2xl mx-auto">
            At KPS Garments, we don't just create clothes - we craft stories that reflect your personality 
            and elevate your everyday style with sophistication and comfort.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;




