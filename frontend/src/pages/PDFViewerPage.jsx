import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  IconButton,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  RotateLeft,
  RotateRight,
  NavigateBefore,
  NavigateNext,
  Fullscreen,
  FullscreenExit,
  Search,
  ArrowBack,
} from '@mui/icons-material';

// Mock data for demonstration
const mockDocument = {
  id: '1',
  title: 'Lease Agreement',
  createdAt: '2025-05-01T10:30:00Z',
  pageCount: 12,
  processed: true,
  extractedText: `This LEASE AGREEMENT (this "Agreement") is made and entered into as of May 1, 2025, by and between LESSOR COMPANY LLC, a Delaware limited liability company ("Lessor"), and TENANT CORPORATION, a California corporation ("Tenant").

WITNESSETH:

WHEREAS, Lessor is the owner of that certain real property located at 123 Main Street, San Francisco, CA 94105 (the "Property"); and

WHEREAS, Tenant desires to lease the Property from Lessor, and Lessor desires to lease the Property to Tenant, all on the terms and conditions hereinafter set forth.

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, Lessor and Tenant hereby agree as follows:

1. LEASE OF PREMISES. Lessor hereby leases to Tenant, and Tenant hereby leases from Lessor, the Property.

2. TERM. The term of this Agreement shall commence on June 1, 2025 (the "Commencement Date") and shall continue for a period of thirty-six (36) months thereafter, ending on May 31, 2028 (the "Term"), unless sooner terminated as provided herein.

3. RENT. Tenant shall pay to Lessor as base rent for the Property the sum of Ten Thousand Dollars ($10,000) per month (the "Base Rent"), payable in advance on the first day of each month during the Term.

4. SECURITY DEPOSIT. Upon execution of this Agreement, Tenant shall deposit with Lessor the sum of Twenty Thousand Dollars ($20,000) as a security deposit (the "Security Deposit").

5. USE. Tenant shall use the Property solely for general office purposes and for no other purpose without the prior written consent of Lessor.

6. MAINTENANCE AND REPAIRS. Tenant shall, at Tenant's sole cost and expense, keep and maintain the Property in good condition and repair during the Term.

7. ALTERATIONS. Tenant shall not make any alterations, additions, or improvements to the Property without the prior written consent of Lessor.

8. ASSIGNMENT AND SUBLETTING. Tenant shall not assign this Agreement or sublet the Property or any part thereof without the prior written consent of Lessor.

9. DEFAULT. If Tenant fails to pay any installment of Base Rent when due, or fails to observe or perform any other covenant or agreement contained herein, and such failure continues for a period of ten (10) days after written notice thereof from Lessor to Tenant, then Lessor may terminate this Agreement and re-enter the Property.

10. GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of the State of California.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.

LESSOR:
LESSOR COMPANY LLC,
a Delaware limited liability company

By: ____________________________
Name: John Smith
Title: Manager

TENANT:
TENANT CORPORATION,
a California corporation

By: ____________________________
Name: Jane Doe
Title: President`,
};

export default function PDFViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  useEffect(() => {
    // Simulate API call to fetch document details
    const fetchDocument = async () => {
      try {
        // In a real implementation, you would fetch from your API
        // const response = await fetch(`http://167.88.36.83:1337/api/pdfs/${id}?populate=*` );
        // const data = await response.json();
        // setDocument(data.data);
        
        // Using mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDocument(mockDocument);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to load document. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    if (document) {
      setCurrentPage(prev => Math.min(prev + 1, document.pageCount));
    }
  };

  const handleFullscreenToggle = () => {
    setFullscreen(prev => !prev);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAnalysisQueryChange = (event) => {
    setAnalysisQuery(event.target.value);
  };

  const handleAnalyze = async () => {
    if (!analysisQuery.trim()) return;
    
    setAnalyzing(true);
    
    try {
      // In a real implementation, you would call your AI analysis API
      // const response = await fetch(`http://167.88.36.83:1337/api/pdfs/${id}/analyze`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     query: analysisQuery,
      //   } ),
      // });
      // const data = await response.json();
      // setAnalysisResult(data.result);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      setAnalysisResult(`Based on my analysis of the document "${document.title}" regarding "${analysisQuery}":

The document contains several sections related to your query. The most relevant information appears on pages 3-5, where the contract specifies the terms and conditions.

Key points:
1. The agreement requires [specific condition related to query]
2. There are exceptions under [relevant section]
3. The parties must comply with [relevant requirements]

This analysis is based on the extracted text from the document. For a more detailed understanding, please consult with a legal professional.`);
    } catch (error) {
      console.error('Error analyzing document:', error);
      setAnalysisResult('Error analyzing document. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading document...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/pdfs')}
          sx={{ mt: 2 }}
        >
          Back to Documents
        </Button>
      </Container>
    );
  }

  if (!document) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography>Document not found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/pdfs')}
          sx={{ mt: 2 }}
        >
          Back to Documents
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/pdfs')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">{document.title}</Typography>
      </Box>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Document" />
        <Tab label="AI Analysis" />
      </Tabs>
      
      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <IconButton onClick={handleZoomOut}>
                <ZoomOut />
              </IconButton>
              <IconButton onClick={handleZoomIn}>
                <ZoomIn />
              </IconButton>
              <IconButton onClick={handleRotateLeft}>
                <RotateLeft />
              </IconButton>
              <IconButton onClick={handleRotateRight}>
                <RotateRight />
              </IconButton>
            </Box>
            
            <Box>
              <TextField
                size="small"
                placeholder="Search in document..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mr: 2 }}
              />
            </Box>
            
            <Box>
              <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
                <NavigateBefore />
              </IconButton>
              <Typography component="span">
                Page {currentPage} of {document.pageCount}
              </Typography>
              <IconButton onClick={handleNextPage} disabled={currentPage === document.pageCount}>
                <NavigateNext />
              </IconButton>
              <IconButton onClick={handleFullscreenToggle}>
                {fullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Box>
          </Box>
          
          <Paper
            elevation={3}
            sx={{
              p: 2,
              minHeight: 600,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-in-out',
              overflow: 'auto',
            }}
          >
            {/* In a real implementation, you would render the PDF using a library like react-pdf */}
            <Box sx={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>
              <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                {document.extractedText}
              </Typography>
            </Box>
          </Paper>
        </>
      )}
      
      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Ask AI about this document
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Ask a question about this document..."
              value={analysisQuery}
              onChange={handleAnalysisQueryChange}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleAnalyze}
              disabled={analyzing || !analysisQuery.trim()}
            >
              {analyzing ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Box>
          
          {analysisResult && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Analysis Result
              </Typography>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {analysisResult}
                </Typography>
              </Paper>
            </>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Document Text
          </Typography>
          <Paper elevation={1} sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {document.extractedText}
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
