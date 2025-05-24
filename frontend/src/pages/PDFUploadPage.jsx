import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Styled components
const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  transition: 'border-color 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function PDFUploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.includes('pdf')) {
      setError('Please select a PDF file');
      return;
    }
    
    setSelectedFile(file);
    setTitle(file.name.replace('.pdf', ''));
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    if (!file.type.includes('pdf')) {
      setError('Please select a PDF file');
      return;
    }
    
    setSelectedFile(file);
    setTitle(file.name.replace('.pdf', ''));
    setError('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, you would upload to your API
      // const formData = new FormData();
      // formData.append('files', selectedFile);
      // const uploadResponse = await fetch('http://167.88.36.83:1337/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // } );
      // const uploadResult = await uploadResponse.json();
      
      // const pdfData = {
      //   data: {
      //     title: title,
      //     file: uploadResult[0].id,
      //   }
      // };
      
      // const createResponse = await fetch('http://167.88.36.83:1337/api/pdfs', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(pdfData ),
      // });
      
      // const newPdf = await createResponse.json();
      
      // Mock upload for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Redirect to PDF list after a short delay
      setTimeout(() => {
        navigate('/pdfs');
      }, 1500);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError('Failed to upload PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Upload Document
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload a PDF document to analyze with AI
        </Typography>
      </Box>
      
      {success ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Document uploaded successfully! Redirecting to document library...
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <UploadBox
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {selectedFile ? (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatFileSize(selectedFile.size)}
                    </Typography>
                    <Button
                      component="label"
                      variant="outlined"
                      sx={{ mt: 2 }}
                    >
                      Change File
                      <VisuallyHiddenInput type="file" accept=".pdf" onChange={handleFileChange} />
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <UploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Drag & Drop your PDF here
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      or
                    </Typography>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<UploadIcon />}
                    >
                      Browse Files
                      <VisuallyHiddenInput type="file" accept=".pdf" onChange={handleFileChange} />
                    </Button>
                  </Box>
                )}
              </UploadBox>
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            <Grid item xs={12}>
              <Stack spacing={3}>
                <TextField
                  label="Document Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!selectedFile}
                  required
                />
                
                {error && (
                  <Alert severity="error">
                    {error}
                  </Alert>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/pdfs')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!selectedFile || loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </form>
      )}
    </Container>
  );
}
