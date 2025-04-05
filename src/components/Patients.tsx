import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Avatar, 
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
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Edit, 
  Trash2,
  User
} from 'lucide-react';

const Patients: React.FC = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, userId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleRowClick = (rowId: number) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  // Updated patient data with enums as strings
  const patients = [
    { 
      id: 1, 
      nom: 'Emma Wilson', 
      prenom: 'Emma', 
      numeroDeDossier: 'D12345', 
      adresse: '123 Main St, Springfield', 
      tel: '+1 (555) 123-4567',
      motifDeConsultation: 'Routine Checkup',
      anamneses: {
        generale: 'No known allergies',
        familiale: 'Diabetes in family',
        locale: 'Mild gum inflammation',
      },
      typeMastication: 'Normal', // Treated as string
      hygieneBuccoDentaire: 'Good', // Treated as string
      antecedentsDentaires: 'None',
    },
    { 
      id: 2, 
      nom: 'Michael Brown', 
      prenom: 'Michael', 
      numeroDeDossier: 'D67890', 
      adresse: '456 Elm St, Springfield', 
      tel: '+1 (555) 234-5678',
      motifDeConsultation: 'Follow-up',
      anamneses: {
        generale: 'Asthma',
        familiale: 'Heart disease in family',
        locale: 'None',
      },
      typeMastication: 'Irregular', // Treated as string
      hygieneBuccoDentaire: 'Fair', // Treated as string
      antecedentsDentaires: 'Cavities treated',
    },
    { 
      id: 3, 
      nom: 'Sophia Chen', 
      prenom: 'Sophia', 
      numeroDeDossier: 'D11223', 
      adresse: '789 Oak St, Springfield', 
      tel: '+1 (555) 345-6789',
      motifDeConsultation: 'Emergency',
      anamneses: {
        generale: 'No known allergies',
        familiale: 'None',
        locale: 'Severe toothache',
      },
      typeMastication: 'Normal', // Treated as string
      hygieneBuccoDentaire: 'Poor', // Treated as string
      antecedentsDentaires: 'Root canal treatment',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Patients
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          sx={{ borderRadius: 2 }}
        >
          Add New Patient
        </Button>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Search patients..."
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
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
              Export
            </Button>
            <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
              Filter
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Num dossier</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Numéro de Dossier</TableCell>
                <TableCell>Adresse</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient) => (
                  <React.Fragment key={patient.id}>
                    <TableRow
                      onClick={() => handleRowClick(patient.id)}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell>
                        <User size={14} style={{ marginRight: 8 }} />
                      </TableCell>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>{patient.nom}</TableCell>
                      <TableCell>{patient.prenom}</TableCell>
                      <TableCell>{patient.numeroDeDossier}</TableCell>
                      <TableCell>{patient.adresse}</TableCell>
                      <TableCell>{patient.tel}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          onClick={(event) => {
                            event.stopPropagation();
                            handleMenuClick(event, patient.id);
                          }}
                        >
                          <MoreVertical size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {expandedRow === patient.id && (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <Table size="small" sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                            <TableBody>
                              <TableRow>
                                <TableCell><strong>Motif de Consultation:</strong></TableCell>
                                <TableCell>{patient.motifDeConsultation}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell><strong>Anamnèses Générale:</strong></TableCell>
                                <TableCell>{patient.anamneses.generale}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell><strong>Anamnèses Familiale:</strong></TableCell>
                                <TableCell>{patient.anamneses.familiale}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell><strong>Anamnèses Locale:</strong></TableCell>
                                <TableCell>{patient.anamneses.locale}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell><strong>Type de Mastication:</strong></TableCell>
                                <TableCell>{patient.typeMastication}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell><strong>Hygiène Bucco-Dentaire:</strong></TableCell>
                                <TableCell>{patient.hygieneBuccoDentaire}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell><strong>Antécédents Dentaires:</strong></TableCell>
                                <TableCell>{patient.antecedentsDentaires}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={patients.length}
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
    </Box>
  );
};

export default Patients;