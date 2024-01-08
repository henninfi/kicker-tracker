import React, { useContext, useState } from "react";

export default function InviteForm() {

    return (
      <div className="w-full max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Card Header */}
        <div className="flex flex-row items-start justify-between p-6 border-b">
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold text-gray-700">Invite a Friend</h2>
            <p className="text-gray-600">Invite your friends to join our App.</p>
          </div>
        </div>
  
        {/* Card Content */}
        <div className="p-6 border-b">
          <div className="space-y-2">
            <label htmlFor="email" className="sr-only">
              Friend's Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Enter your friend's email address"
            />
          </div>
        </div>
  
        {/* Card Footer */}
        <div className="p-6 border-t">
          <button className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
            Send Invitation
          </button>
        </div>
  
        {/* Additional Message */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Invitation has been sent successfully!</p>
        </div>
      </div>
    );
  }
  