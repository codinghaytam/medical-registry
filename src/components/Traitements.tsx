import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2,
  Calendar,
  Clipboard,
  Image
} from 'lucide-react';

const Traitements: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTraitementId, setSelectedTraitementId] = useState<number | null>(null);
  const [hoveredText, setHoveredText] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, traitementId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedTraitementId(traitementId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTraitementId(null);
  };

  const handleMouseEnter = (text: string, event: React.MouseEvent) => {
    setHoveredText(text);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredText(null);
    setHoverPosition(null);
  };

  // Sample traitements data
  const traitements = [
    { 
      id: 1, 
      type: 'Parodontologie', 
      date: '10/01/2025', 
      indicePlaque: 'Long indice plaque text that needs truncation.',
      indiceGingivale: 'Long indice gingivale text that needs truncation.',
      sondagePoches: 'image1.png',
      patient: 'John Doe',
      user: { name: 'Dr. Smith', role: 'Dentist' }
    },
    // ...more rows
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Traitements
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          sx={{ borderRadius: 2 }}
        >
          Add New Traitement
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Search Traitements..."
            variant="outlined"
            size="small"
            sx={{ width: { xs: '100%', sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>id-traitement</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Indice de Plaque</TableCell>
                <TableCell>Indice Gingivale</TableCell>
                <TableCell>Sondage des Poches</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {traitements
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((traitement) => (
                  <TableRow
                    key={traitement.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{traitement.id}</TableCell>
                    <TableCell>{traitement.type}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Calendar size={14} style={{ marginRight: 8 }} />
                        {traitement.date}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 150,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(event) => handleMouseEnter(traitement.indicePlaque, event)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {traitement.indicePlaque}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 150,
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(event) => handleMouseEnter(traitement.indiceGingivale, event)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {traitement.indiceGingivale}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Image size={14} style={{ marginRight: 8 }} />
                        {traitement.sondagePoches}
                      </Box>
                    </TableCell>
                    <TableCell>{traitement.patient}</TableCell>
                    <TableCell>
                      {traitement.user.name} ({traitement.user.role})
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(event) => handleMenuClick(event, traitement.id)}
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={traitements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              borderRadius: 1,
              mb: 0.5,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit size={16} style={{ marginRight: 8 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      {hoveredText && hoverPosition && (
        <Box
          sx={{
            position: 'fixed',
            top: hoverPosition.y + 10,
            left: hoverPosition.x + 10,
            backgroundColor: 'white',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            padding: 1,
            zIndex: 1000,
            maxWidth: 300,
            wordWrap: 'break-word',
          }}
        >
          <Typography variant="body2">{hoveredText}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Traitements;
