// API service for connecting to the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Save password check to database
export const savePasswordCheck = async (checkData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password-checks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        strength: checkData.strength,
        score: checkData.score,
        has_emoji: checkData.hasEmoji,
        suggestions: checkData.suggestions
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save password check');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving password check:', error);
    throw error;
  }
};

// Get password check history
export const getPasswordHistory = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password-checks?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch password history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching password history:', error);
    throw error;
  }
};

// Delete a password check from history
export const deletePasswordCheck = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password-checks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete password check');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting password check:', error);
    throw error;
  }
};

// Get statistics about password checks
export const getPasswordStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/password-checks/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch password stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching password stats:', error);
    throw error;
  }
};
