import type { SubjectId } from './types';

export interface SimulationMeta {
  id: string;
  subjectId: SubjectId;
  title: string;
  summary: string;
  guidingQuestion: string;
  conceptIds: string[];
}

export const SIMULATIONS_META: SimulationMeta[] = [
  {
    id: 'sim-mean-median',
    subjectId: 'xs',
    title: 'Mean, Median và Ngoại lệ',
    summary: 'Mô phỏng ảnh hưởng của điểm dữ liệu ngoại lệ đối với trung bình và trung vị.',
    guidingQuestion: 'Khi kéo một điểm ra rất xa, trung bình hay trung vị thay đổi mạnh hơn?',
    conceptIds: ['XS05', 'XS06']
  },
  {
    id: 'sim-bayes',
    subjectId: 'xs',
    title: 'Bayes và Tỷ lệ nền (Base Rate)',
    summary: 'Mô phỏng xác suất có bệnh khi nhận kết quả dương tính dựa trên tỷ lệ mắc, độ nhạy và dương tính giả.',
    guidingQuestion: 'Vì sao một xét nghiệm có độ nhạy 90% nhưng người nhận kết quả dương tính lại chỉ có xác suất mắc bệnh chưa tới 10%?',
    conceptIds: ['XS11', 'XS12', 'XS13']
  },
  {
    id: 'sim-confusion-matrix',
    subjectId: 'ml',
    title: 'Confusion Matrix và Ngưỡng phân loại',
    summary: 'Khám phá sự đánh đổi giữa Precision, Recall và F1 khi thay đổi ngưỡng quyết định (threshold).',
    guidingQuestion: 'Khi hạ thấp ngưỡng quyết định, Recall và Precision thay đổi như thế nào trên tập dữ liệu cố định?',
    conceptIds: ['ML29', 'ML30', 'ML31']
  },
  {
    id: 'sim-overfitting',
    subjectId: 'ml',
    title: 'Độ phức tạp mô hình và Overfitting',
    summary: 'So sánh sai số huấn luyện và sai số kiểm chứng khi tăng bậc đa thức từ 1 đến 7.',
    guidingQuestion: 'Mô hình nào khớp tập train tốt nhất? Mô hình nào tốt nhất trên validation? Vì sao chúng có thể khác nhau?',
    conceptIds: ['ML16', 'ML17', 'ML18']
  },
  {
    id: 'sim-neuron',
    subjectId: 'dl',
    title: 'Một nơ-ron nhân tạo tính gì?',
    summary: 'Trực quan hóa phép nhân trọng số, cộng bias và áp dụng hàm kích hoạt phi tuyến.',
    guidingQuestion: 'Nơ-ron nhận đầu vào và biến đổi qua trọng số, bias rồi phi tuyến ra sao trước khi đưa ra kết quả?',
    conceptIds: ['DL03', 'DL05', 'DL06']
  },
  {
    id: 'sim-gradient-descent',
    subjectId: 'dl',
    title: 'Gradient Descent tối ưu một tham số',
    summary: 'Mô phỏng quá trình cập nhật trọng số trên hàm mất mát L(w) = (w - 3)² với các mức learning rate khác nhau.',
    guidingQuestion: 'Điều gì xảy ra khi learning rate quá nhỏ, vừa vặn, bằng 1, hoặc lớn hơn 1?',
    conceptIds: ['DL09', 'DL10', 'DL11', 'DL13']
  },
  {
    id: 'sim-binary-search',
    subjectId: 'gt',
    title: 'Binary Search từng bước',
    summary: 'Quan sát các chỉ số left, right, mid và quá trình thu hẹp không gian tìm kiếm.',
    guidingQuestion: 'Mỗi bước chia đôi mảng giúp loại bỏ bao nhiêu phần tử và tại sao độ phức tạp là O(log n)?',
    conceptIds: ['GT02', 'GT12', 'GT13']
  },
  {
    id: 'sim-bfs-dfs',
    subjectId: 'gt',
    title: 'Duyệt đồ thị: BFS và DFS',
    summary: 'So sánh cách BFS dùng hàng đợi (Queue) để tìm đường đi ngắn nhất theo số cạnh với DFS dùng ngăn xếp (Stack).',
    guidingQuestion: 'Tại sao BFS tìm được đường đi ngắn nhất theo số cạnh trên đồ thị không trọng số còn DFS thì không?',
    conceptIds: ['GT08', 'GT09', 'GT24', 'GT26', 'GT27']
  }
];

export const SUBJECT_INFO: Record<SubjectId, {
  name: string;
  shortName: string;
  description: string;
  color: string;
  accentColor: string;
  bgLight: string;
  order: number;
}> = {
  xs: {
    name: 'Xác suất thống kê',
    shortName: 'Xác suất',
    description: 'Mô tả dữ liệu, đo lường sự bất định, xác suất có điều kiện, định lý Bayes, phân phối và kiểm định giả thuyết.',
    color: '#2b5c8f',
    accentColor: '#1d426a',
    bgLight: '#eef4fa',
    order: 1
  },
  ml: {
    name: 'Machine Learning',
    shortName: 'ML',
    description: 'Quy trình học từ dữ liệu, xử lý đặc trưng, các mô hình học có giám sát/không giám sát, đánh giá và tổng quát hóa.',
    color: '#27624a',
    accentColor: '#1b4534',
    bgLight: '#eef5f1',
    order: 2
  },
  dl: {
    name: 'Deep Learning',
    shortName: 'DL',
    description: 'Mạng nơ-ron sâu, hàm kích hoạt, forward/backward pass, thuật toán tối ưu, CNN, RNN và Transformer.',
    color: '#8a4b16',
    accentColor: '#63350e',
    bgLight: '#faf2ea',
    order: 3
  },
  gt: {
    name: 'Giải thuật & Cấu trúc dữ liệu',
    shortName: 'Giải thuật',
    description: 'Độ phức tạp Big-O, cấu trúc dữ liệu kinh điển, tìm kiếm, sắp xếp, đệ quy, đồ thị, tham lam và quy hoạch động.',
    color: '#1b6b68',
    accentColor: '#124947',
    bgLight: '#ecf6f5',
    order: 4
  }
};

// Map of concept connections (relatedIds, prerequisiteIds)
export const CONCEPT_METADATA: Record<string, { relatedIds?: string[]; prerequisiteIds?: string[] }> = {
  // XS
  XS01: { relatedIds: ['XS03', 'ML01', 'ML02'] },
  XS02: { relatedIds: ['XS03', 'ML02', 'ML12'] },
  XS03: { relatedIds: ['XS01', 'XS04', 'XS23'] },
  XS04: { relatedIds: ['XS03', 'ML07', 'ML08'] },
  XS05: { relatedIds: ['XS06', 'XS07'], prerequisiteIds: ['XS02'] },
  XS06: { relatedIds: ['XS05', 'XS08', 'XS24'], prerequisiteIds: ['XS05'] },
  XS07: { relatedIds: ['XS05', 'XS06', 'ML11'] },
  XS08: { relatedIds: ['XS06', 'XS23'], prerequisiteIds: ['XS06'] },
  XS09: { relatedIds: ['XS11', 'XS12'] },
  XS10: { relatedIds: ['XS09', 'GT02'] },
  XS11: { relatedIds: ['XS09', 'XS12', 'XS13', 'ML30'], prerequisiteIds: ['XS09'] },
  XS12: { relatedIds: ['XS11', 'XS13', 'ML26'], prerequisiteIds: ['XS11'] },
  XS13: { relatedIds: ['XS11', 'XS12', 'ML30'] },
  XS14: { relatedIds: ['XS09', 'XS11', 'ML26'] },
  XS15: { relatedIds: ['XS02', 'XS16', 'XS18'] },
  XS16: { relatedIds: ['XS15', 'XS17', 'XS18', 'DL08'] },
  XS17: { relatedIds: ['XS16', 'XS18'] },
  XS18: { relatedIds: ['XS16', 'XS19'] },
  XS19: { relatedIds: ['XS18', 'XS20', 'ML26'] },
  XS20: { relatedIds: ['XS18', 'XS21'] },
  XS21: { relatedIds: ['XS20', 'XS22'] },
  XS22: { relatedIds: ['XS21', 'XS23', 'XS24', 'ML13'] },
  XS23: { relatedIds: ['XS03', 'XS22', 'XS24'] },
  XS24: { relatedIds: ['XS22', 'XS23', 'XS25', 'XS26'] },
  XS25: { relatedIds: ['XS24', 'XS26'] },
  XS26: { relatedIds: ['XS24', 'XS27', 'XS28'] },
  XS27: { relatedIds: ['XS26', 'XS29', 'XS30'] },
  XS28: { relatedIds: ['XS26', 'XS27'] },
  XS29: { relatedIds: ['XS27', 'XS30', 'XS31'] },
  XS30: { relatedIds: ['XS27', 'XS29', 'XS33'] },
  XS31: { relatedIds: ['XS27', 'XS32'] },
  XS32: { relatedIds: ['XS31', 'ML19'] },
  XS33: { relatedIds: ['XS29', 'XS30', 'ML34'] },
  XS34: { relatedIds: ['XS29', 'XS30'] },
  XS35: { relatedIds: ['XS12', 'DL08', 'ML15'] },

  // ML
  ML01: { relatedIds: ['DL01', 'GT01', 'XS01'] },
  ML02: { relatedIds: ['ML01', 'ML03', 'DL02'] },
  ML03: { relatedIds: ['ML02', 'ML09', 'DL15'] },
  ML04: { relatedIds: ['ML01', 'ML19', 'ML20'] },
  ML05: { relatedIds: ['ML04', 'ML27'] },
  ML06: { relatedIds: ['ML07', 'ML08', 'ML11'] },
  ML07: { relatedIds: ['ML06', 'ML08', 'ML16', 'DL16'] },
  ML08: { relatedIds: ['ML07', 'ML11', 'ML13'] },
  ML09: { relatedIds: ['ML07', 'ML08', 'ML03'] },
  ML10: { relatedIds: ['ML07', 'ML09'] },
  ML11: { relatedIds: ['ML08', 'XS07', 'ML13'] },
  ML12: { relatedIds: ['ML02', 'ML13', 'DL27'] },
  ML13: { relatedIds: ['XS22', 'ML19', 'DL23'] },
  ML14: { relatedIds: ['ML29', 'ML30', 'ML31'] },
  ML15: { relatedIds: ['DL08', 'DL09', 'DL11'] },
  ML16: { relatedIds: ['ML07', 'ML17', 'ML18', 'DL22'] },
  ML17: { relatedIds: ['ML16', 'ML18'] },
  ML18: { relatedIds: ['ML16', 'ML17', 'DL22'] },
  ML19: { relatedIds: ['XS32', 'ML20', 'DL03'] },
  ML20: { relatedIds: ['ML19', 'DL06', 'DL07'] },
  ML21: { relatedIds: ['GT12', 'ML22'] },
  ML22: { relatedIds: ['ML23', 'GT21'] },
  ML23: { relatedIds: ['ML22', 'ML24'] },
  ML24: { relatedIds: ['ML23', 'ML17'] },
  ML25: { relatedIds: ['ML19', 'ML20'] },
  ML26: { relatedIds: ['XS12', 'XS14'] },
  ML27: { relatedIds: ['ML05', 'ML28'] },
  ML28: { relatedIds: ['ML27', 'DL02'] },
  ML29: { relatedIds: ['ML30', 'ML31', 'XS11'] },
  ML30: { relatedIds: ['ML29', 'ML31', 'XS11', 'XS13'] },
  ML31: { relatedIds: ['ML29', 'ML30', 'ML32'] },
  ML32: { relatedIds: ['ML30', 'ML31'] },
  ML33: { relatedIds: ['ML19', 'DL08'] },
  ML34: { relatedIds: ['ML07', 'ML29', 'ML33'] },
  ML35: { relatedIds: ['ML06', 'ML34'] },

  // DL
  DL01: { relatedIds: ['ML01', 'DL03', 'DL04'] },
  DL02: { relatedIds: ['ML02', 'DL03'] },
  DL03: { relatedIds: ['ML19', 'DL04', 'DL05', 'DL06'] },
  DL04: { relatedIds: ['DL03', 'DL05', 'DL07'] },
  DL05: { relatedIds: ['DL03', 'DL06'] },
  DL06: { relatedIds: ['DL05', 'ML20', 'DL07'] },
  DL07: { relatedIds: ['DL06', 'DL08', 'ML20'] },
  DL08: { relatedIds: ['ML15', 'DL07', 'DL10'] },
  DL09: { relatedIds: ['DL10', 'DL11', 'ML15'] },
  DL10: { relatedIds: ['DL09', 'DL11', 'DL12'] },
  DL11: { relatedIds: ['DL09', 'DL10', 'DL21'] },
  DL12: { relatedIds: ['DL11', 'DL21'] },
  DL13: { relatedIds: ['DL11', 'DL21', 'DL33'] },
  DL14: { relatedIds: ['DL08', 'DL10'] },
  DL15: { relatedIds: ['ML03', 'DL12', 'DL13'] },
  DL16: { relatedIds: ['ML07', 'ML16', 'DL22'] },
  DL17: { relatedIds: ['DL16', 'DL22', 'ML18'] },
  DL18: { relatedIds: ['DL04', 'DL08', 'DL10', 'DL11'] },
  DL19: { relatedIds: ['DL03', 'DL05', 'DL20'] },
  DL20: { relatedIds: ['DL06', 'DL19', 'DL34'] },
  DL21: { relatedIds: ['DL11', 'DL12', 'DL13'] },
  DL22: { relatedIds: ['ML18', 'DL16', 'DL17'] },
  DL23: { relatedIds: ['ML13', 'DL19', 'DL20'] },
  DL24: { relatedIds: ['DL25', 'DL04'] },
  DL25: { relatedIds: ['DL24'] },
  DL26: { relatedIds: ['DL27', 'DL31', 'DL32'] },
  DL27: { relatedIds: ['ML12', 'DL26', 'DL31'] },
  DL28: { relatedIds: ['DL01', 'DL35'] },
  DL29: { relatedIds: ['DL12', 'GT03'] },
  DL30: { relatedIds: ['DL11', 'DL13', 'DL19', 'DL20'] },
  DL31: { relatedIds: ['DL26', 'DL32'] },
  DL32: { relatedIds: ['DL26', 'DL31'] },
  DL33: { relatedIds: ['DL13', 'DL21'] },
  DL34: { relatedIds: ['DL20', 'DL24'] },
  DL35: { relatedIds: ['DL07', 'DL28', 'XS11'] },

  // GT
  GT01: { relatedIds: ['GT02', 'GT03', 'ML01'] },
  GT02: { relatedIds: ['GT01', 'GT03', 'GT04', 'GT05'] },
  GT03: { relatedIds: ['GT02', 'DL29'] },
  GT04: { relatedIds: ['GT02', 'GT05', 'GT17'] },
  GT05: { relatedIds: ['GT02', 'GT12', 'GT15'] },
  GT06: { relatedIds: ['GT07', 'DL02'] },
  GT07: { relatedIds: ['GT06', 'GT08', 'GT09'] },
  GT08: { relatedIds: ['GT09', 'GT19', 'GT27'] },
  GT09: { relatedIds: ['GT08', 'GT26'] },
  GT10: { relatedIds: ['GT11', 'GT06'] },
  GT11: { relatedIds: ['GT10'] },
  GT12: { relatedIds: ['GT02', 'GT05', 'GT13'] },
  GT13: { relatedIds: ['GT12'] },
  GT14: { relatedIds: ['GT15', 'GT16', 'GT17', 'GT18'] },
  GT15: { relatedIds: ['GT14', 'GT16'] },
  GT16: { relatedIds: ['GT14', 'GT17', 'GT20'] },
  GT17: { relatedIds: ['GT14', 'GT16', 'GT04'] },
  GT18: { relatedIds: ['GT14', 'GT15', 'GT16', 'GT17'] },
  GT19: { relatedIds: ['GT08', 'GT20', 'GT30'] },
  GT20: { relatedIds: ['GT16', 'GT19'] },
  GT21: { relatedIds: ['GT22', 'GT24'] },
  GT22: { relatedIds: ['GT21', 'GT12'] },
  GT23: { relatedIds: ['GT21', 'GT28'] },
  GT24: { relatedIds: ['GT25', 'GT26', 'GT27'] },
  GT25: { relatedIds: ['GT24'] },
  GT26: { relatedIds: ['GT09', 'GT24', 'GT25', 'GT27'] },
  GT27: { relatedIds: ['GT08', 'GT24', 'GT26'] },
  GT28: { relatedIds: ['GT24', 'GT26', 'GT23'] },
  GT29: { relatedIds: ['GT30'] },
  GT30: { relatedIds: ['GT19', 'GT31'] },
  GT31: { relatedIds: ['GT30'] },
  GT32: { relatedIds: ['GT19', 'GT27'] },
  GT33: { relatedIds: ['GT12', 'GT34'] },
  GT34: { relatedIds: ['GT33', 'GT35'] },
  GT35: { relatedIds: ['GT06', 'GT34'] }
};

// Exam question related concept mapping
export const EXAM_RELATED_CONCEPTS: Record<string, string[]> = {
  'exam-1-q1': ['GT01', 'GT02', 'GT03'],
  'exam-1-q2': ['XS05', 'XS06'],
  'exam-1-q3': ['ML04', 'ML05', 'ML27'],
  'exam-1-q4': ['ML07', 'ML16', 'DL16'],
  'exam-1-q5': ['DL01', 'DL04', 'DL05'],
  'exam-1-q6': ['GT12', 'GT13'],
  'exam-1-q7': ['GT08', 'GT09', 'GT26'],

  'exam-2-q1': ['ML14', 'ML29', 'ML30'],
  'exam-2-q2': ['ML29', 'ML30', 'ML31'],
  'exam-2-q3': ['XS09', 'XS11', 'XS14'],
  'exam-2-q4': ['XS11', 'XS12', 'XS13', 'ML30'],
  'exam-2-q5': ['DL12', 'DL13'],
  'exam-2-q6': ['DL09', 'DL11', 'DL13'],
  'exam-2-q7': ['GT02', 'GT05'],

  'exam-3-q1': ['ML07', 'ML10', 'ML08'],
  'exam-3-q2': ['ML08', 'ML13'],
  'exam-3-q3': ['ML16', 'ML18', 'DL16', 'DL22'],
  'exam-3-q4': ['DL24', 'ML22', 'ML23'],
  'exam-3-q5': ['DL13', 'DL15', 'DL21'],
  'exam-3-q6': ['GT10', 'GT11'],
  'exam-3-q7': ['XS03', 'XS04'],

  'exam-4-q1': ['XS29', 'XS30', 'XS33'],
  'exam-4-q2': ['XS24', 'XS26'],
  'exam-4-q3': ['ML19', 'ML20', 'DL06'],
  'exam-4-q4': ['ML22', 'ML23', 'ML24'],
  'exam-4-q5': ['DL10', 'DL11', 'DL21'],
  'exam-4-q6': ['GT29', 'GT30'],
  'exam-4-q7': ['DL31', 'DL32', 'DL28']
};
