import { useState } from 'react'
import { Container, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Button } from '@mui/material'
import './App.css'
import axios from 'axios';

function App() {
  const [rawPrompt, setRawPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post("http://localhost:8080/api/prompt/enhance", {
        rawPrompt
      });

      setRefinedPrompt(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('An error occurred while optimizing your prompt. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    } 
  };

  return (
    <Container maxWidth="md" sx={{py: 5}}>
      <Typography variant='h3' component="h1" gutterBottom>
        AI-Assisted Prompt Optimization Tool
      </Typography>

      <Box sx={{ mx: 3}}>
        <TextField 
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          label="Original Prompt"
          value={rawPrompt || ''}
          onChange={(e) => setRawPrompt(e.target.value)}
          sx={{ mb: 2 }}/>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!rawPrompt || loading}
            fullWidth>
            {loading ? <CircularProgress size={24} /> : 'Enhance Prompt'}
          </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      {refinedPrompt && (

        <Box sx={{ mx: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Refined Prompt:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={refinedPrompt || ''}
            InputProps={{
              readOnly: true,
            }}/>
          
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigator.clipboard.writeText(refinedPrompt)}>
            Copy Refined Prompt to Clipboard
          </Button>
        </Box>
      )}

    </Container>
  )
}

export default App
