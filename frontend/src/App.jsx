import { useState } from 'react'
import { Container, Typography, Box, TextField, CircularProgress, Button, Paper } from '@mui/material'
import './App.css'
import axios from 'axios';

function App() {
  const [rawPrompt, setRawPrompt] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        "http://localhost:8080/api/prompt/enhance",
        { rawPrompt }
      )

      setRefinedPrompt(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data, null, 2)
      )
    } catch (err) {
      setError(
        'An error occurred while optimizing your prompt. Please try again.'
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 4,
          backdropFilter: 'blur(8px)',
          background: 'rgba(255,255,255,0.85)'
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1
            }}
          >
            AI Prompt Optimizer
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: 'text.secondary' }}
          >
            Transform rough ideas into high-quality AI prompts
          </Typography>
        </Box>

        {/* Input Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            variant="outlined"
            label="Original Prompt"
            placeholder="Enter your rough idea here..."
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!rawPrompt || loading}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : null
            }
            sx={{
              py: 1.5,
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              background:
                'linear-gradient(90deg, #6366f1, #3b82f6)',
              '&:hover': {
                background:
                  'linear-gradient(90deg, #4f46e5, #2563eb)'
              }
            }}
          >
            {loading ? 'Enhancing...' : 'Enhance Prompt'}
          </Button>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>

        {/* Output Section */}
        {refinedPrompt && (
          <Box
            className="fade-in"
            sx={{
              mt: 5,
              p: 3,
              borderRadius: 3,
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Refined Prompt
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={6}
              value={refinedPrompt}
              InputProps={{
                readOnly: true
              }}
            />

            <Button
              variant="outlined"
              sx={{
                mt: 2,
                borderRadius: 2,
                textTransform: 'none'
              }}
              onClick={() =>
                navigator.clipboard.writeText(refinedPrompt)
              }
            >
              Copy to Clipboard
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  )
}

export default App