import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users', { withCredentials: true });
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users');
      }
    };
    
    const fetchScenarios = async () => {
      try {
        const response = await axios.get('/admin/scenarios', { withCredentials: true });
        setScenarios(response.data);
      } catch (error) {
        setError('Failed to fetch scenarios');
      }
    };

    fetchUsers();
    fetchScenarios();
    setLoading(false);
  }, []);

  const toggleAdminStatus = async (userId) => {
    try {
      await axios.put(`/admin/users/${userId}/admin`, {}, { withCredentials: true });
      setUsers(users.map(user => user.id === userId ? { ...user, admin: !user.admin } : user));
    } catch (error) {
      setError('Failed to update admin status');
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/admin/users/${userId}`, { withCredentials: true });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.admin ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => toggleAdminStatus(user.id)}>
                  {user.admin ? 'Revoke Admin' : 'Make Admin'}
                </button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Scenarios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>User Input</th>
            <th>Generated Scenario</th>
            <th>Video Filename</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map(scenario => (
            <tr key={scenario.id}>
              <td>{scenario.id}</td>
              <td>{scenario.user_id}</td>
              <td>{scenario.user_input}</td>
              <td>{scenario.generated_scenario}</td>
              <td>{scenario.video_filename}</td>
              <td>{new Date(scenario.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
