import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Invoice, Client } from './types';
import api from '../services/api';

interface InvoiceState {
  invoices: Invoice[];
  clients: Client[];
}

const initialState: InvoiceState = {
  invoices: [],
  clients: [],
};

// Types for thunks

export const fetchInvoices = createAsyncThunk<Invoice[]>('invoices/fetchInvoices', async () => {
  const response = await api.getInvoices();
  let data: Invoice[] = [];
  if (response.data && typeof response.data === 'object' && 'invoices' in response.data && Array.isArray((response.data as any).invoices)) {
    data = (response.data as any).invoices;
  } else {
    data = (response.data as Invoice[]) || [];
  }
  // Normalize: ensure every invoice has a string 'id'
  return data.map(inv => ({ ...inv, id: typeof inv.id === 'string' ? inv.id : (typeof inv._id === 'string' ? inv._id : Math.random().toString(36).slice(2)) }));
});

export const createInvoice = createAsyncThunk<Invoice, Parameters<typeof api.createInvoice>[0], { rejectValue: string }>(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await api.createInvoice(invoiceData);
      if (!response.success) {
        console.error('Create Invoice Error:', response);
        return rejectWithValue(response.message || 'Failed to create invoice');
      }
      return response.data as Invoice;
    } catch (err) {
      let message = 'Unknown error';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as any).message;
      }
      console.error('Create Invoice Exception:', err);
      return rejectWithValue(message);
    }
  }
);

export const updateInvoiceAsync = createAsyncThunk<Invoice, { id: string; invoiceData: Partial<Invoice> }, { rejectValue: string }>(
  'invoices/updateInvoice',
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await api.updateInvoice(id, invoiceData);
      return response.data as Invoice;
    } catch (err) {
      let message = 'Unknown error';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as any).message;
      }
      return rejectWithValue(message);
    }
  }
);

export const deleteInvoiceAsync = createAsyncThunk<string, string, { rejectValue: string }>(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.deleteInvoice(id);
      if (response.success) return id;
      return rejectWithValue(response.message || 'Delete failed');
    } catch (err) {
      let message = 'Unknown error';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as any).message;
      }
      return rejectWithValue(message);
    }
  }
);

export const createClient = createAsyncThunk<Client, Parameters<typeof api.createClient>[0], { rejectValue: string }>(
  'invoices/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await api.createClient(clientData);
      if (!response.success) {
        console.error('Create Client Error:', response);
        return rejectWithValue(response.message || 'Failed to create client');
      }
      return response.data as Client;
    } catch (err) {
      let message = 'Unknown error';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as any).message;
      }
      console.error('Create Client Exception:', err);
      return rejectWithValue(message);
    }
  }
);

export const fetchClients = createAsyncThunk<Client[]>('invoices/fetchClients', async () => {
  const response = await api.getClients();
  let data: Client[] = [];
  if (response.data && typeof response.data === 'object' && 'clients' in response.data && Array.isArray((response.data as any).clients)) {
    data = (response.data as any).clients;
  } else {
    data = (response.data as Client[]) || [];
  }
  // Normalize: ensure every client has a string 'id'
  return data.map(client => ({ ...client, id: typeof client.id === 'string' ? client.id : (typeof client._id === 'string' ? client._id : Math.random().toString(36).slice(2)) }));
});

export const updateInvoiceStatusAsync = createAsyncThunk<Invoice, { id: string; status: Invoice['status'] }, { rejectValue: string }>(
  'invoices/updateInvoiceStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.updateInvoiceStatus(id, status);
      return response.data as Invoice;
    } catch (err) {
      let message = 'Unknown error';
      if (typeof err === 'object' && err !== null && 'message' in err) {
        message = (err as any).message;
      }
      return rejectWithValue(message);
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.push(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(inv => inv.id !== action.payload);
    },
    updateInvoiceStatus: (state, action: PayloadAction<{ id: string; status: Invoice['status'] }>) => {
      const invoice = state.invoices.find(inv => inv.id === action.payload.id);
      if (invoice) {
        invoice.status = action.payload.status;
      }
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter(client => client.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload || [];
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.clients = action.payload || [];
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        if (action.payload) state.invoices.push({ ...action.payload, id: typeof action.payload.id === 'string' ? action.payload.id : (typeof action.payload._id === 'string' ? action.payload._id : Math.random().toString(36).slice(2)) });
      })
      .addCase(updateInvoiceAsync.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      })
      .addCase(deleteInvoiceAsync.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(inv => inv.id !== action.payload);
      })
      .addCase(createClient.fulfilled, (state, action) => {
        if (action.payload) state.clients.push({ ...action.payload, id: typeof action.payload.id === 'string' ? action.payload.id : (typeof action.payload._id === 'string' ? action.payload._id : Math.random().toString(36).slice(2)) });
      })
      .addCase(updateInvoiceStatusAsync.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(inv => inv.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
      });
  },
});

export const {
  addInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  addClient,
  updateClient,
  deleteClient,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;