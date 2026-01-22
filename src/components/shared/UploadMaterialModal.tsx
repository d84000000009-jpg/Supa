// src/components/shared/UploadMaterialModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Upload,
  Save,
  X,
  FileText,
  Music,
  Video,
  Image,
  Link,
  File,
  Users,
  Tag
} from "lucide-react";
import { Material, Class, MaterialType } from "../../types";

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (materialData: Omit<Material, 'id'>) => void;
  availableClasses: Class[];
  teacherId: number;
}

export function UploadMaterialModal({ 
  isOpen, 
  onClose, 
  onSave,
  availableClasses,
  teacherId
}: UploadMaterialModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'document' as MaterialType,
    url: '',
    filename: '',
    size: 0,
    classId: 0, // 0 = todas as turmas
    isPublic: false,
    tags: [] as string[]
  });

  const [currentTag, setCurrentTag] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const materialTypes = [
    { value: 'document', label: 'Documento', icon: FileText, color: 'text-blue-600', accept: '.pdf,.doc,.docx,.txt' },
    { value: 'video', label: 'Vídeo', icon: Video, color: 'text-red-600', accept: '.mp4,.avi,.mov,.wmv' },
    { value: 'audio', label: 'Áudio', icon: Music, color: 'text-green-600', accept: '.mp3,.wav,.aac,.m4a' },
    { value: 'image', label: 'Imagem', icon: Image, color: 'text-purple-600', accept: '.jpg,.jpeg,.png,.gif' },
    { value: 'link', label: 'Link/URL', icon: Link, color: 'text-orange-600', accept: '' },
    { value: 'pdf', label: 'PDF', icon: File, color: 'text-indigo-600', accept: '.pdf' }
  ];

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        filename: file.name,
        size: file.size,
        title: prev.title || file.name.split('.')[0]
      }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (formData.type === 'link') {
      if (!formData.url.trim()) {
        newErrors.url = 'URL é obrigatória para links';
      } else {
        try {
          new URL(formData.url);
        } catch {
          newErrors.url = 'URL inválida';
        }
      }
    } else {
      if (!selectedFile) {
        newErrors.file = 'Selecione um arquivo';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Simular upload de arquivo
      const materialData = {
        ...formData,
        url: selectedFile ? `uploads/${selectedFile.name}` : formData.url,
        uploadedBy: teacherId,
        uploadedAt: new Date().toISOString(),
        downloadCount: 0,
        classId: formData.classId === 0 ? undefined : formData.classId
      };
      onSave(materialData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      type: 'document',
      url: '',
      filename: '',
      size: 0,
      classId: 0,
      isPublic: false,
      tags: []
    });
    setCurrentTag('');
    setSelectedFile(null);
    setErrors({});
    onClose();
  };

  const selectedType = materialTypes.find(t => t.value === formData.type);
  const selectedClass = availableClasses.find(c => c.id === formData.classId);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload de Material
              </DialogTitle>
              <DialogDescription>
                Envie materiais didáticos para suas turmas
              </DialogDescription>
            </div>
      
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo de Material */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tipo de Material</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {materialTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                      formData.type === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`h-6 w-6 ${type.color}`} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload de Arquivo ou URL */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {formData.type === 'link' ? 'Link/URL' : 'Arquivo'}
            </h3>
            
            {formData.type === 'link' ? (
              <div className="space-y-2">
                <Label htmlFor="url">URL do Material *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://exemplo.com/material"
                  className={errors.url ? 'border-red-500' : ''}
                />
                {errors.url && (
                  <p className="text-sm text-red-500">{errors.url}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Clique para selecionar ou arraste o arquivo aqui
                    </p>
                    <p className="text-xs text-gray-500">
                      Tipos aceitos: {selectedType?.accept}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept={selectedType?.accept}
                    onChange={handleFileSelect}
                    className="mt-4"
                  />
                </div>
                
                {selectedFile && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {selectedType && <selectedType.icon className={`h-8 w-8 ${selectedType.color}`} />}
                        <div className="flex-1">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {errors.file && (
                  <p className="text-sm text-red-500">{errors.file}</p>
                )}
              </div>
            )}
          </div>

          {/* Informações do Material */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações do Material</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nome do material"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="classId">Turma de Destino</Label>
                <select
                  id="classId"
                  value={formData.classId}
                  onChange={(e) => handleInputChange('classId', Number(e.target.value))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value={0}>Todas as minhas turmas</option>
                  {availableClasses.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name} ({classItem.students} estudantes)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva o conteúdo e como usar este material..."
                rows={3}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags (Palavras-chave)</Label>
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Ex: grammar, listening, vocabulary..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Tag className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <div key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-primary hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Configurações */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isPublic" className="text-sm font-medium">
                Tornar público para outros professores
              </label>
            </div>
          </div>

          {/* Preview */}
          {formData.title && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <Card className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {selectedType && <selectedType.icon className={`h-6 w-6 ${selectedType.color} mt-1`} />}
                    <div className="flex-1">
                      <h4 className="font-semibold">{formData.title}</h4>
                      {formData.description && (
                        <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formData.classId === 0 ? 'Todas as turmas' : selectedClass?.name}
                        </div>
                        {selectedFile && (
                          <span>{formatFileSize(selectedFile.size)}</span>
                        )}
                        <span>{selectedType?.label}</span>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {formData.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-muted text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Upload Material
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}