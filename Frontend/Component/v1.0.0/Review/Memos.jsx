import { useState, useEffect } from "react"


const Memos = ({ state }) => {
  const [memos, setMemos] = useState([])
  const { contract } = state

  useEffect(() => {
    const memosMessage = async () => {
      if (contract) {
        const memos = await contract.getMemos()
        setMemos(memos)
      }
    }
    memosMessage()
  }, [contract])

  return (
    <div className=" bg-gradient-to-r from-purple-900 via-blue-800 to-indigo-900  px-4 sm:px-6 lg:px-8">
    
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-white ">Messages</h2>
        <div className="bg-white bg-opacity-10 overflow-hidden shadow-xl sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 bg-opacity-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Timestamp</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Message</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">From</th>
                </tr>
              </thead>
              <tbody className="bg-white bg-opacity-5 divide-y divide-gray-200">
                {memos.map((memo, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 bg-opacity-5' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{memo.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{new Date(memo.timestamp * 1000).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{memo.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{memo.from}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Memos