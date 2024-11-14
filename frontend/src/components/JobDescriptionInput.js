import React, { useState } from 'react';

const JobDescriptionInput = () => {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder: Implement job description submission functionality
    console.log('Submitting job description:', description);
  };

  return (
    <div>
      <h2>Submit Job Description</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="6"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default JobDescriptionInput;