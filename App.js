import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useReducer
} from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';

// ===============================
// 1. DATA AWAL TUGAS
// ===============================

const initialTasks = [
  {
    id: '1',
    nama: 'Membuat Program Counter',
    matkul: 'Pemrograman Visual',
    deskripsi: 'Membuat aplikasi counter menggunakan useState.',
    deadline: '12 November 2026',
    status: 'Belum Dikerjakan'
  },
  {
    id: '2',
    nama: 'Laporan Data Warehouse',
    matkul: 'Data Warehouse',
    deskripsi: 'Menyusun laporan karakteristik data warehouse.',
    deadline: '14 November 2026',
    status: 'Selesai'
  },
  {
    id: '3',
    nama: 'Membuat Use Case Diagram',
    matkul: 'PBO',
    deskripsi: 'Membuat diagram use case sistem informasi.',
    deadline: '16 November 2026',
    status: 'Belum Dikerjakan'
  },
  {
    id: '4',
    nama: 'Jurnal Keamanan Jaringan',
    matkul: 'Keamanan Informasi',
    deskripsi: 'Mencari jurnal keamanan jaringan.',
    deadline: '18 November 2026',
    status: 'Belum Dikerjakan'
  },
  {
    id: '5',
    nama: 'Praktik React Native',
    matkul: 'Pemrograman Visual',
    deskripsi: 'Membuat tampilan aplikasi menggunakan Expo.',
    deadline: '20 November 2026',
    status: 'Selesai'
  }
];

// ===============================
// 2. REDUCER
// ===============================

const taskReducer = (state, action) => {
  switch (action.type) {

    case 'ADD_TASK':
      return [action.payload, ...state];

    case 'DELETE_TASK':
      return state.filter(
        task => task.id !== action.payload
      );

    case 'TOGGLE_STATUS':
      return state.map(task =>
        task.id === action.payload
          ? {
              ...task,
              status:
                task.status === 'Selesai'
                  ? 'Belum Dikerjakan'
                  : 'Selesai'
            }
          : task
      );

    case 'RESET_TASKS':
      return [];

    default:
      return state;
  }
};

// ===============================
// 3. KOMPONEN ANAK TASK CARD
// ===============================

const TaskCard = ({ item, onToggle, onDelete }) => {
  const selesai = item.status === 'Selesai';

  return (
    <View style={styles.taskCard}>

      <View style={styles.taskHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.taskName}>
            {item.nama}
          </Text>

          <Text style={styles.matkul}>
            {item.matkul}
          </Text>
        </View>

        <View style={[
          styles.statusBadge,
          selesai ? styles.statusSelesai : styles.statusBelum
        ]}>
          <Text style={[
            styles.statusText,
            { color: selesai ? '#16845B' : '#C47B19' }
          ]}>
            {selesai ? 'Selesai' : 'Belum'}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        {item.deskripsi}
      </Text>

      <Text style={styles.deadline}>
        📅 Deadline: {item.deadline}
      </Text>

      <View style={styles.actionRow}>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: selesai ? '#E9A23B' : '#248A66' }
          ]}
          onPress={() => onToggle(item.id)}
        >
          <Text style={styles.actionText}>
            {selesai ? 'Batalkan' : 'Selesaikan'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionText}>
            Hapus
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

// ===============================
// 4. KOMPONEN UTAMA APP
// ===============================

export default function App() {

  // useReducer untuk mengelola daftar tugas
  const [tasks, dispatch] = useReducer(
    taskReducer,
    initialTasks
  );

  // useState untuk input
  const [nama, setNama] = useState('');
  const [matkul, setMatkul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [deadline, setDeadline] = useState('');
  const [keyword, setKeyword] = useState('');

  // useRef untuk mengakses TextInput
  const namaRef = useRef(null);

  // useEffect untuk memantau pencarian
  useEffect(() => {
    console.log('Keyword pencarian:', keyword);
  }, [keyword]);

  // useMemo untuk menghitung ringkasan
  const total = useMemo(
    () => tasks.length,
    [tasks]
  );

  const belum = useMemo(
    () => tasks.filter(
      task => task.status === 'Belum Dikerjakan'
    ).length,
    [tasks]
  );

  const selesai = useMemo(
    () => tasks.filter(
      task => task.status === 'Selesai'
    ).length,
    [tasks]
  );

  // useMemo untuk pencarian
  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      task.nama.toLowerCase().includes(keyword.toLowerCase()) ||
      task.matkul.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [tasks, keyword]);

  // useCallback untuk menambahkan tugas
  const tambahTugas = useCallback(() => {

    if (
      !nama.trim() ||
      !matkul.trim() ||
      !deskripsi.trim() ||
      !deadline.trim()
    ) {
      Alert.alert(
        'Peringatan',
        'Semua kolom harus diisi!'
      );
      return;
    }

    const tugasBaru = {
      id: Date.now().toString(),
      nama: nama.trim(),
      matkul: matkul.trim(),
      deskripsi: deskripsi.trim(),
      deadline: deadline.trim(),
      status: 'Belum Dikerjakan'
    };

    dispatch({
      type: 'ADD_TASK',
      payload: tugasBaru
    });

    setNama('');
    setMatkul('');
    setDeskripsi('');
    setDeadline('');

    namaRef.current?.focus();

    Alert.alert(
      'Berhasil',
      'Tugas berhasil ditambahkan!'
    );

  }, [nama, matkul, deskripsi, deadline]);

  // useCallback untuk menghapus tugas
  const hapusTugas = useCallback((id) => {
    Alert.alert(
      'Hapus Tugas',
      'Apakah kamu yakin ingin menghapus tugas ini?',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => dispatch({
            type: 'DELETE_TASK',
            payload: id
          })
        }
      ]
    );
  }, []);

  // useCallback untuk mengubah status
  const ubahStatus = useCallback((id) => {
    dispatch({
      type: 'TOGGLE_STATUS',
      payload: id
    });
  }, []);

  // useCallback untuk reset seluruh tugas
  const resetTugas = useCallback(() => {
    Alert.alert(
      'Reset Tugas',
      'Hapus seluruh data tugas?',
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => dispatch({
            type: 'RESET_TASKS'
          })
        }
      ]
    );
  }, []);

  // ===============================
  // 5. TAMPILAN APLIKASI
  // ===============================

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}

        renderItem={({ item }) => (
          <TaskCard
            item={item}
            onToggle={ubahStatus}
            onDelete={hapusTugas}
          />
        )}

        ListHeaderComponent={
          <View>

            <Text style={styles.title}>
              Manajemen Tugas
            </Text>

            <Text style={styles.subtitle}>
              Kelola tugas kuliahmu dengan lebih mudah.
            </Text>

            {/* RINGKASAN */}

            <Text style={styles.sectionTitle}>
              Ringkasan Tugas
            </Text>

            <View style={styles.summaryContainer}>

              <View style={styles.summaryCard}>
                <Text style={styles.totalNumber}>
                  {total}
                </Text>
                <Text style={styles.summaryLabel}>
                  Total Tugas
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.pendingNumber}>
                  {belum}
                </Text>
                <Text style={styles.summaryLabel}>
                  Belum Selesai
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.doneNumber}>
                  {selesai}
                </Text>
                <Text style={styles.summaryLabel}>
                  Selesai
                </Text>
              </View>

            </View>

            {/* FORM TAMBAH TUGAS */}

            <View style={styles.formCard}>

              <Text style={styles.formTitle}>
                + Tambah Tugas Baru
              </Text>

              <TextInput
                ref={namaRef}
                style={styles.input}
                placeholder="Nama tugas"
                value={nama}
                onChangeText={setNama}
              />

              <TextInput
                style={styles.input}
                placeholder="Nama mata kuliah"
                value={matkul}
                onChangeText={setMatkul}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Deskripsi tugas"
                value={deskripsi}
                onChangeText={setDeskripsi}
                multiline
              />

              <TextInput
                style={styles.input}
                placeholder="Deadline (contoh: 25 November 2026)"
                value={deadline}
                onChangeText={setDeadline}
              />

              <TouchableOpacity
                style={styles.addButton}
                onPress={tambahTugas}
              >
                <Text style={styles.addButtonText}>
                  + Simpan Tugas
                </Text>
              </TouchableOpacity>

            </View>

            {/* PENCARIAN */}

            <Text style={styles.sectionTitle}>
              Daftar Tugas
            </Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama tugas atau mata kuliah..."
              value={keyword}
              onChangeText={setKeyword}
            />

            <Text style={styles.resultText}>
              Menampilkan {filteredTasks.length} tugas
            </Text>

          </View>
        }

        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Tidak ada tugas yang ditemukan.
          </Text>
        }

        ListFooterComponent={
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetTugas}
          >
            <Text style={styles.resetText}>
              Reset Seluruh Tugas
            </Text>
          </TouchableOpacity>
        }

        contentContainerStyle={styles.listContent}
      />

    </View>
  );
}

// ===============================
// 6. STYLE APLIKASI
// ===============================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F7FC'
  },

  listContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 35
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#243B64'
  },

  subtitle: {
    fontSize: 14,
    color: '#8491A5',
    marginTop: 7
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#243B64',
    marginTop: 25,
    marginBottom: 15
  },

  summaryContainer: {
    flexDirection: 'row',
    gap: 9
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 2
  },

  totalNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#315C9B'
  },

  pendingNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#D99025'
  },

  doneNumber: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#16845B'
  },

  summaryLabel: {
    fontSize: 10,
    color: '#718096',
    marginTop: 6,
    textAlign: 'center'
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 15,
    marginTop: 25,
    elevation: 2
  },

  formTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#243B64',
    marginBottom: 15
  },

  input: {
    backgroundColor: '#F4F7FC',
    borderWidth: 1,
    borderColor: '#E1E7F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    marginBottom: 11,
    color: '#243B64'
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },

  addButton: {
    backgroundColor: '#315C9B',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14
  },

  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E7F0',
    padding: 13,
    borderRadius: 12,
    fontSize: 13,
    color: '#243B64'
  },

  resultText: {
    fontSize: 12,
    color: '#8491A5',
    marginTop: 10,
    marginBottom: 13
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 13,
    elevation: 2
  },

  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },

  taskName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#243B64'
  },

  matkul: {
    fontSize: 12,
    color: '#527DB5',
    marginTop: 5
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20
  },

  statusSelesai: {
    backgroundColor: '#E3F6ED'
  },

  statusBelum: {
    backgroundColor: '#FFF2DC'
  },

  statusText: {
    fontSize: 10,
    fontWeight: 'bold'
  },

  description: {
    fontSize: 13,
    color: '#718096',
    marginTop: 13,
    lineHeight: 19
  },

  deadline: {
    fontSize: 12,
    color: '#718096',
    marginTop: 12
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15
  },

  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 9,
    alignItems: 'center'
  },

  deleteButton: {
    backgroundColor: '#D9534F'
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },

  emptyText: {
    textAlign: 'center',
    color: '#8491A5',
    padding: 25
  },

  resetButton: {
    backgroundColor: '#FCE8E8',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },

  resetText: {
    color: '#C0392B',
    fontWeight: 'bold',
    fontSize: 13
  }

});
