import { useState, useEffect } from "react";

function App() {
  const [newtrip, setnewtrip] = useState(false);
  const [tripname, settripname] = useState("");
  const [members, setMembers] = useState([]);
  const [oldtrip, setoldtrip] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [split, setSplit] = useState(0);

  // Load trips from localStorage
  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem("oldtrip")) || [];
    setoldtrip(savedTrips);
  }, []);

  // Save trips to localStorage
  const saveToLocalStorage = (updatedTrips) => {
    localStorage.setItem("oldtrip", JSON.stringify(updatedTrips));
    setoldtrip(updatedTrips);
  };

  const calculateSplit = (updatedExpenses = expenses, updatedMembers = members) => {
    const totalExpenses = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const numberOfMembers = updatedMembers.filter((member) => member.trim() !== "").length;

    const splitAmount = numberOfMembers > 0 ? totalExpenses / numberOfMembers : 0;
    setSplit(splitAmount);
  };

  const handleNewTrip = () => {
    setnewtrip(true);
    settripname("");
    setMembers([]);
    setExpenses([]);
    setSplit(0);
    setSelectedTrip(null);
  };

  const handleAddMember = () => {
    const updatedMembers = [...members, ""];
    setMembers(updatedMembers);
    calculateSplit(expenses, updatedMembers);
  };

  const handleMemberChange = (index, value) => {
    const updatedMembers = members.map((member, i) => (i === index ? value : member));
    setMembers(updatedMembers);
    calculateSplit(expenses, updatedMembers);
  };

  const handleAddExpense = () => {
    const expenseName = prompt("Enter expense name:");
    const expenseAmount = prompt("Enter expense amount:");

    if (expenseName && expenseAmount) {
      const newExpense = {
        name: expenseName,
        amount: parseFloat(expenseAmount),
      };

      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      calculateSplit(updatedExpenses, members);
    }
  };

  const handleSaveTrip = () => {
    const newTrip = {
      tripname,
      members,
      expenses,
    };

    // Append new trip without overwriting existing trips
    const updatedTrips = [...oldtrip, newTrip];
    saveToLocalStorage(updatedTrips);

    settripname("");
    setMembers([]);
    setExpenses([]);
    setSplit(0);
    setnewtrip(false);
    alert("Trip saved!");
  };

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setnewtrip(false);
    settripname(trip.tripname);
    setMembers(trip.members);
    setExpenses(trip.expenses);
    calculateSplit(trip.expenses, trip.members);
  };

  const handleDeleteTrip = (index) => {
    const updatedTrips = oldtrip.filter((_, i) => i !== index);
    saveToLocalStorage(updatedTrips);
    setSelectedTrip(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 to-indigo-600 p-8">
      <h1 className="text-center text-white font-bold text-4xl mb-8">Expense Splitter</h1>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Manage Trips</h2>
          <button
            onClick={handleNewTrip}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Create New Trip
          </button>
          <button
            onClick={() => setnewtrip(false)}
            className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
          >
            View Old Trips
          </button>
        </div>

        {newtrip ? (
          <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create New Trip</h2>
            <input
              type="text"
              placeholder="Trip Name"
              value={tripname}
              onChange={(e) => settripname(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
            />
            <h3 className="font-bold mb-2">Members</h3>
            {members.map((member, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  placeholder={`Member ${index + 1}`}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}
            <button
              onClick={handleAddMember}
              className="bg-green-500 text-white py-2 px-4 rounded-md mt-2 hover:bg-green-600 transition"
            >
              Add Member
            </button>
            <h3 className="font-bold mt-6 mb-2">Expenses</h3>
            <button
              onClick={handleAddExpense}
              className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition"
            >
              Add Expense
            </button>
            <div className="mt-4">
              <h4 className="font-bold">Split Amount:</h4>
              <p className="text-green-600">{split > 0 ? `$${split.toFixed(2)} per member` : "No expenses yet."}</p>
            </div>
            <button
              onClick={handleSaveTrip}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-6 hover:bg-blue-600 transition"
            >
              Save Trip
            </button>
          </div>
        ) : selectedTrip ? (
          <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{selectedTrip.tripname}</h2>
            <h3 className="font-bold mb-2">Members:</h3>
            <ul>
              {selectedTrip.members.map((member, index) => (
                <li key={index} className="border-b py-2">
                  {member.trim() ? `${member} owes $${split.toFixed(2)}` : ""}
                </li>
              ))}
            </ul>
            <h3 className="font-bold mt-4 mb-2">Expenses:</h3>
            <ul>
              {selectedTrip.expenses.map((expense, index) => (
                <li key={index} className="border-b py-2">
                  {expense.name}: ${expense.amount.toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedTrip(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
              >
                Back
              </button>
              <button
                onClick={() => handleDeleteTrip(oldtrip.indexOf(selectedTrip))}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
              >
                Delete Trip
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Previous Trips</h2>
            <ul>
              {oldtrip.map((trip, index) => (
                <li
                  key={index}
                  className="border-b py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleTripClick(trip)}
                >
                  {trip.tripname}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

