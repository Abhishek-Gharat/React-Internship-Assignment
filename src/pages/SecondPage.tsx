import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MainLayout from '../Layout/MainLayout';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'title', headerName: 'Title', width: 300 },
  { field: 'body', headerName: 'Description', width: 500 },
];

const SecondPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    if (!userDetails) {
      navigate('/');
      return;
    }

    const { name, email } = JSON.parse(userDetails);
    setUserName(name);
    setUserEmail(email);

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
        setPosts(response.data);
      } catch (error) {
        setError('Error fetching posts. Please try again later.');
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  if (loading) {
    return (
      <MainLayout>
        <Typography variant="h4" component="h1" gutterBottom>
          Posts
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Typography variant="h6" component="div" gutterBottom color="error">
          {error}
        </Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Posts
        </Typography>
        <Box textAlign="right">
          <Typography variant="subtitle1">{userName}</Typography>
          <Typography variant="body2" color="textSecondary">{userEmail}</Typography>
        </Box>
      </div>
      <div style={{ height: 600, width: '100%', maxWidth: '100%' }}>
        <DataGrid rows={posts} columns={columns} />
      </div>
    </MainLayout>
  );
};

export default SecondPage;
