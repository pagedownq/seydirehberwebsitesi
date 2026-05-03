import React, { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { supabase } from '../../../lib/supabase';
import { 
  collection, 
  query, 
  where,
  getDocs,
  orderBy, 
  onSnapshot, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { Plus, Trash2, Edit, X, Loader2, Search, GripVertical } from 'lucide-react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  type DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { COLLECTIONS } from '../types';
import { format } from 'date-fns';
import { sendFCMNotification } from '../../../lib/fcm';

interface ManageCollectionProps {
  collectionId: string;
  initialFilterId?: string | null;
  onTabChange?: (tab: string, filterId: string | null) => void;
}

const ManageCollection: React.FC<ManageCollectionProps> = ({ collectionId, initialFilterId, onTabChange }) => {
  const config = COLLECTIONS[collectionId];
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialFilterId || '');

  useEffect(() => {
    // We always want to fetch companies for filtering and picking
    const q = query(collection(db, 'firmalar'), orderBy('ad'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCompanies(snapshot.docs.map(doc => ({ id: doc.id, ad: doc.data().ad, kategori: doc.data().kategori })));
    });
    return unsubscribe;
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setLoading(true);
    // Determine sort field based on collection type
    // If it's firmalar, we use 'order', then 'ad'
    let q = query(collection(db, collectionId));
    
    // Sort logic will be applied locally on the fetched items
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
      
      // Perform manual sorting for specific collections
      if (config.reorderable) {
        docs.sort((a, b) => {
          const aOrder = a.order ?? 999999;
          const bOrder = b.order ?? 999999;
          if (aOrder !== bOrder) return aOrder - bOrder;
          // Use name/title as secondary sort for deterministic order
          const nameA = a.ad || a.title || a.baslik || a.guzergah || '';
          const nameB = b.ad || b.title || b.baslik || b.guzergah || '';
          return nameA.toLowerCase().localeCompare(nameB.toLowerCase(), undefined, { sensitivity: 'base' });
        });
      } else {
        // Fallback sorts for other collections
        const sortField = collectionId === 'yardim_destek' ? 'tarih' : 
                          collectionId === 'reviews' ? 'createdAt' : 'created_at';
        docs.sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];
          if (!aVal) return -1; // Put new/null items at the top
          if (!bVal) return 1;
          return bVal - aVal; // Descending
        });
      }
      
      setItems(docs);
      setLoading(false);
    }, (error) => {
      console.error('Firestore Error:', error);
      // Fallback
      const qFallback = query(collection(db, collectionId));
      onSnapshot(qFallback, (snapshot) => {
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
    });
    return unsubscribe;
  }, [collectionId]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Update orders in Firestore using a batch for performance
    try {
      const batch = writeBatch(db);
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        if (item.order !== i) {
          batch.update(doc(db, collectionId, item.id), { order: i });
        }
      }
      await batch.commit();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
      // Initialize existing images from 'images' array or fallback to 'image_url'/'gorsel'
      const imgs = item.images || (item.image_url ? [item.image_url] : (item.gorsel ? [item.gorsel] : []));
      setExistingImages(imgs);
    } else {
      setEditingItem(null);
      // Pre-fill companyId if filtering is active
      const defaults: any = {};
      if (selectedCompanyId) {
        defaults.companyId = selectedCompanyId;
        const company = companies.find(c => c.id === selectedCompanyId);
        if (company) {
          defaults.companyName = company.ad;
          defaults.companyCategory = company.kategori;
        }
      }
      setFormData(defaults);
      setExistingImages([]);
    }
    setSelectedFiles([]);
    setImagesToDelete([]);
    setShowModal(true);
  };

  const handleUploadImage = async (file: File): Promise<string> => {
    if (!config.bucket) return '';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name.replace(/\s+/g, '_')}`;
    
    const { error } = await supabase.storage
      .from(config.bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return '';
    }

    const { data: { publicUrl } } = supabase.storage
      .from(config.bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 1. Upload new files in parallel
      const newImageUrls = await Promise.all(
        selectedFiles.map(file => handleUploadImage(file))
      );
      
      const validNewUrls = newImageUrls.filter(url => url !== '');
      const finalImages = [...existingImages, ...validNewUrls];

      // 2. Delete removed images from Storage
      if (config.bucket && imagesToDelete.length > 0) {
        const fileNames = imagesToDelete.map(url => {
          try {
            return new URL(url).pathname.split('/').pop() || '';
          } catch {
            return url.split('/').pop() || '';
          }
        }).filter(name => name !== '');
        
        if (fileNames.length > 0) {
          await supabase.storage.from(config.bucket).remove(fileNames);
        }
      }

      const cleanData = { ...formData };
      delete cleanData.id;
      
      // Update image arrays
      cleanData.images = finalImages;
      cleanData.image_url = finalImages.length > 0 ? finalImages[0] : null;
      if (config.bucket === 'firmalar') cleanData.gorsel = cleanData.image_url;
      
      // Handle specialized fields
      config.fields.forEach(f => {
        if (f.isNumber) {
          const val = cleanData[f.key];
          cleanData[f.key] = (val === '' || val === null || val === undefined) ? (f.required ? 0 : null) : Number(val);
        }
        if (f.isDate && cleanData[f.key] && typeof cleanData[f.key] === 'string') {
          cleanData[f.key] = Timestamp.fromDate(new Date(cleanData[f.key]));
        }
        if (f.isBoolean) cleanData[f.key] = !!cleanData[f.key];
        if (!f.required && (cleanData[f.key] === '' || cleanData[f.key] === undefined)) {
          cleanData[f.key] = null;
        }
      });

      if (editingItem) {
        await updateDoc(doc(db, collectionId, editingItem.id), cleanData);
      } else {
        cleanData.created_at = serverTimestamp();
        if (config.reorderable) {
            const existingOrders = items.map(i => i.order).filter(o => typeof o === 'number');
            const minOrder = existingOrders.length > 0 ? Math.min(...existingOrders) : 0;
            cleanData.order = minOrder - 1;
        }

        if (collectionId === 'admins') {
          const email = cleanData.email?.toLowerCase().trim();
          if (!email) throw new Error('Email gereklidir');
          await setDoc(doc(db, 'admins', email), cleanData);
        } else {
          await addDoc(collection(db, collectionId), cleanData);
        }
      }

      setShowModal(false);
    } catch (err) {
      console.error('Error saving:', err);
      alert('Kaydedilirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, itemData: any) => {
    if (!window.confirm('Bu ögeyi silmek istediğinize emin misiniz?')) return;
    
    try {
      const images = itemData.images || (itemData.image_url ? [itemData.image_url] : (itemData.gorsel ? [itemData.gorsel] : []));
      
      if (images.length > 0 && config.bucket) {
        const fileNames = images.map((url: string) => {
          try {
            return new URL(url).pathname.split('/').pop() || '';
          } catch {
            return url.split('/').pop() || '';
          }
        }).filter((name: string) => name !== '');

        if (fileNames.length > 0) {
          await supabase.storage.from(config.bucket).remove(fileNames);
        }
      }
      await deleteDoc(doc(db, collectionId, id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFirm = !selectedCompanyId || item.companyId === selectedCompanyId;
    return matchesSearch && matchesFirm;
  });

  return (
    <div className="collection-view">
      <div className="header">
        <div>
          <h1>{config.title}</h1>
          <p className="text-muted">{items.length} kayıt bulundu</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {config.fields.some(f => f.isCompanyPicker) && (
            <select 
              className="input" 
              style={{ width: '200px', fontSize: '0.85rem' }}
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
            >
              <option value="">Tüm Firmalar</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.ad}</option>
              ))}
            </select>
          )}
          <div className="input-group" style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input 
              className="input" 
              placeholder="Ara..." 
              style={{ paddingLeft: '2.5rem', width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Ekle
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="table">
            <thead>
              <tr>
                {config.reorderable && <th style={{ width: '40px' }}></th>}
                {config.bucket && <th>Görsel</th>}
                <th>Bilgi / İçerik</th>
                {collectionId === 'yardim_destek' && <th>Durum</th>}
                <th>İşlem</th>
              </tr>
            </thead>
            <SortableContext 
              items={filteredItems.map(i => i.id)} 
              strategy={verticalListSortingStrategy}
              disabled={!config.reorderable}
            >
              <tbody>
                {filteredItems.map((item) => (
                    <SortableRow 
                        key={item.id} 
                        item={item} 
                        collectionId={collectionId} 
                        config={config} 
                        isDraggable={config.reorderable && searchTerm === ''} // Disable drag if searching
                        handleOpenModal={handleOpenModal}
                        handleDelete={() => handleDelete(item.id, item)}
                        onTabChange={onTabChange}
                    />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </DndContext>
        {loading && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Loader2 className="spin" />
            <p>Yükleniyor...</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--admin-border)'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{editingItem ? 'Ögeyi Düzenle' : 'Yeni Öge Ekle'}</h2>
              <button 
                className="btn btn-outline" 
                style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', justifyContent: 'center' }} 
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {config.bucket && (
                <div className="form-group">
                  <label className="label">Fotoğraflar</label>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {/* ADD BUTTON */}
                    <div 
                      className="img-preview" 
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      <Plus size={24} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Ekle</div>
                    </div>

                    {/* EXISTING IMAGES */}
                    {existingImages.map((url, idx) => (
                      <div key={`existing-${idx}`} className="image-gallery-item">
                        <img src={url} alt="Existing" />
                        <button 
                          type="button"
                          className="remove-img-btn"
                          onClick={() => {
                            setExistingImages(existingImages.filter(u => u !== url));
                            setImagesToDelete([...imagesToDelete, url]);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {/* NEWLY SELECTED IMAGES */}
                    {selectedFiles.map((file, idx) => (
                      <div key={`new-${idx}`} className="image-gallery-item">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="New" 
                          style={{ border: '2px solid var(--admin-primary)' }} 
                        />
                        <button 
                          type="button"
                          className="remove-img-btn"
                          style={{ background: '#000' }}
                          onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <input 
                    type="file" 
                    id="fileInput" 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setSelectedFiles([...selectedFiles, ...files]);
                    }}
                  />
                </div>
              )}

              {config.fields.filter(f => !f.key.startsWith('canManage')).map(field => (
                <div className="form-group" key={field.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label className="label" style={{ marginBottom: 0 }}>{field.label}</label>
                    {field.key === 'expiry_date' && (
                      <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <input 
                          type="checkbox" 
                          checked={!formData[field.key]} 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, [field.key]: null });
                            } else {
                              setFormData({ ...formData, [field.key]: Timestamp.now() });
                            }
                          }} 
                        />
                        Sınırsız
                      </label>
                    )}
                  </div>
                  
                  {field.isTimeList ? (
                    <div className="time-list-editor">
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input 
                          type="time" 
                          className="input" 
                          id={`time-input-${field.key}`}
                          style={{ width: 'auto' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const btn = document.getElementById(`time-add-btn-${field.key}`);
                              btn?.click();
                            }
                          }}
                        />
                        <button 
                          type="button"
                          id={`time-add-btn-${field.key}`}
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                          onClick={() => {
                            const input = document.getElementById(`time-input-${field.key}`) as HTMLInputElement;
                            if (input && input.value) {
                              const currentTimes = (formData[field.key] as string || '')
                                .split(',')
                                .map(t => t.trim())
                                .filter(t => t !== '');
                              
                              if (!currentTimes.includes(input.value)) {
                                const newTimes = [...currentTimes, input.value].sort();
                                setFormData({ ...formData, [field.key]: newTimes.join(',') });
                              }
                              
                              input.value = '';
                              setTimeout(() => {
                                input.focus();
                              }, 10);
                            }
                          }}
                        >
                          Saat Ekle
                        </button>

                        {field.key === 'saatler_hergun' && (
                          <button 
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                            onClick={() => {
                              const currentTimes = formData['saatler_hergun'] || '';
                              if (currentTimes) {
                                setFormData({
                                  ...formData,
                                  saatler_haftaici: currentTimes,
                                  saatler_cumartesi: currentTimes,
                                  saatler_pazar: currentTimes
                                });
                              }
                            }}
                          >
                            Tüm Günlere Kopyala
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {(formData[field.key] as string || '')
                          .split(',')
                          .map(t => t.trim())
                          .filter(t => t !== '')
                          .sort()
                          .map(time => (
                            <div key={time} style={{ 
                              background: 'var(--primary)', 
                              color: 'white', 
                              padding: '2px 8px', 
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {time}
                              <X 
                                size={12} 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => {
                                  const newTimes = (formData[field.key] as string)
                                    .split(',')
                                    .map(t => t.trim())
                                    .filter(t => t !== time && t !== '');
                                  setFormData({ ...formData, [field.key]: newTimes.join(',') });
                                }}
                              />
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ) : field.isCompanyPicker ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input 
                        className="input"
                        placeholder="Firma ara..."
                        value={companySearch}
                        onChange={(e) => setCompanySearch(e.target.value)}
                        style={{ padding: '0.4rem', fontSize: '0.8rem' }}
                      />
                      <select 
                        className="input"
                        value={formData[field.key] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updates: any = { [field.key]: val };
                          if ((collectionId === 'coupons' || collectionId === 'esnaf_users') && field.key === 'companyId') {
                            const company = companies.find(c => c.id === val);
                            if (company) {
                                updates.companyName = company.ad;
                                updates.companyCategory = company.kategori;
                            }
                          }
                          setFormData({ ...formData, ...updates });
                        }}
                        disabled={!companies.length}
                      >
                        <option value="">Firma Seçin (Boş Bırakılabilir)</option>
                        {companies
                          .filter(c => c.ad.toLowerCase().includes(companySearch.toLowerCase()))
                          .map(c => (
                            <option key={c.id} value={c.id}>{c.ad}</option>
                          ))
                        }
                      </select>
                      {formData[field.key] && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Seçili ID: {formData[field.key]}
                        </div>
                      )}
                    </div>
                  ) : field.multiline ? (
                    <textarea 
                      className="input" 
                      rows={4}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    />
                  ) : field.isBoolean ? (
                    <div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={formData[field.key] || false}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  ) : (
                    <input 
                      className="input"
                      type={field.isDate ? 'date' : field.isTime ? 'time' : field.isNumber ? 'number' : 'text'}
                      value={(() => {
                        const val = formData[field.key];
                        if (field.isDate && val && typeof val === 'object' && val.seconds) {
                          return new Date(val.seconds * 1000).toISOString().split('T')[0];
                        }
                        return val || '';
                      })()}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      disabled={field.key === 'expiry_date' && !formData[field.key]}
                    />
                  )}
                </div>
              ))}

              {/* Special Handling for Permissions in Admin Management */}
              {collectionId === 'admins' && config.fields.some(f => f.key.startsWith('canManage')) && (
                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  borderRadius: '1.25rem',
                  border: '1px solid var(--admin-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--admin-text)' }}>Yönetici Yetkileri</h3>
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', height: 'auto' }}
                      onClick={() => {
                        const permissions = config.fields.filter(f => f.key.startsWith('canManage'));
                        const allOn = permissions.every(p => formData[p.key]);
                        const updates: any = {};
                        permissions.forEach(p => updates[p.key] = !allOn);
                        setFormData({ ...formData, ...updates });
                      }}
                    >
                      {config.fields.filter(f => f.key.startsWith('canManage')).every(p => formData[p.key]) ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {config.fields.filter(f => f.key.startsWith('canManage')).map(field => (
                      <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--admin-border)' }}>
                        <label className="switch" style={{ transform: 'scale(0.8)' }}>
                          <input 
                            type="checkbox" 
                            checked={formData[field.key] || false}
                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.checked })}
                          />
                          <span className="slider"></span>
                        </label>
                        <span style={{ fontSize: '0.85rem', color: 'var(--admin-text)', fontWeight: 500 }}>{field.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-actions" style={{ marginTop: '2.5rem' }}>
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="spin" size={20} />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      {editingItem ? <Edit size={20} /> : <Plus size={20} />}
                      {editingItem ? 'Değişiklikleri Kaydet' : 'Sisteme Ekle'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SortableRow = ({ item, collectionId, config, isDraggable, handleOpenModal, handleDelete, onTabChange }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? 'var(--glass-bg)' : 'transparent',
    zIndex: isDragging ? 2 : 1,
    position: 'relative' as any,
    borderBottom: '1px solid var(--border)'
  };

  const handleEsnafAccess = async (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation();
    try {
      const q = query(collection(db, "esnaf_users"), where("companyId", "==", companyId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        // Account exists, set credentials and redirect
        const esnafUserId = snapshot.docs[0].id;
        localStorage.setItem("esnaf_user_id", esnafUserId);
        localStorage.setItem("esnaf_firma_id", companyId);
        
        // Redirect reliably in same tab to avoid popup blockers
        window.location.href = `/esnaf?auto_user=${esnafUserId}&auto_company=${companyId}`;
      } else {
        alert("Bu firmaya ait bir esnaf hesabı bulunamadı. Esnaf Yönetimi sayfasına yönlendiriliyorsunuz.");
        if (onTabChange) {
          onTabChange('esnaf_users', companyId);
        }
      }
    } catch (err) {
      console.error("Esnaf access error:", err);
      alert("Yönlendirme sırasında bir hata oluştu.");
    }
  };

  return (
    <tr ref={setNodeRef} style={style}>
      {config.reorderable && (
        <td style={{ padding: '1rem', cursor: isDraggable ? 'grab' : 'default' }} {...attributes} {...listeners}>
          <GripVertical size={20} style={{ color: 'var(--text-muted)' }} />
        </td>
      )}
      {config.bucket && (
        <td style={{ padding: '1rem' }}>
          <img 
            src={item.image_url || item.gorsel || '/assets/fotoyok.png'} 
            alt="" 
            style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', border: '1px solid var(--border)' }}
          />
        </td>
      )}
      <td style={{ padding: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text)' }}>
          {item.ad || item.title || item.baslik || item.ad_soyad || item.companyName || item.userName || item.username || item.guzergah || 'İsimsiz'}
          {item.rating && <span style={{ color: '#f59e0b', marginLeft: '0.75rem', fontSize: '0.9rem' }}>★ {item.rating}</span>}
          {item.order !== undefined && <span style={{ color: 'var(--text-muted)', marginLeft: '0.75rem', fontSize: '0.8rem', fontWeight: 400 }}>(Sıra: {item.order})</span>}
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {item.kategori && <span style={{ background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: '4px' }}>{item.kategori}</span>}
          {item.tarih?.toDate && (
            <span><i className="bi bi-clock me-1"></i> {format(item.tarih.toDate(), 'dd.MM.yyyy HH:mm')}</span>
          )}
          {item.createdAt?.toDate && (
            <span><i className="bi bi-calendar3 me-1"></i> {format(item.createdAt.toDate(), 'dd.MM.yyyy HH:mm')}</span>
          )}
          
          {/* QUICK LINKS FOR FIRMALAR */}
          {collectionId === 'firmalar' && onTabChange && (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); onTabChange('coupons', item.id); }}
                className="btn btn-outline" 
                style={{ fontSize: '0.7rem', padding: '2px 8px', height: 'auto', borderColor: '#fbbf24', color: '#fbbf24' }}
              >
                Kuponlar
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onTabChange('reviews', item.id); }}
                className="btn btn-outline" 
                style={{ fontSize: '0.7rem', padding: '2px 8px', height: 'auto', borderColor: '#6366f1', color: '#6366f1' }}
              >
                Yorumlar
              </button>
              <button 
                onClick={(e) => handleEsnafAccess(e, item.id)}
                className="btn btn-outline" 
                style={{ fontSize: '0.7rem', padding: '2px 8px', height: 'auto', borderColor: '#10b981', color: '#10b981' }}
              >
                Esnaf Paneli
              </button>
            </div>
          )}
        </div>

        {/* Specialized Information Display */}
        {(collectionId === 'yardim_destek' || collectionId === 'reviews' || collectionId === 'coupons' || collectionId === 'sikayetler') && (
          <div style={{ 
            background: 'rgba(15, 23, 42, 0.4)', 
            padding: '1rem', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            marginTop: '0.5rem'
          }}>
            {collectionId === 'yardim_destek' && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  {item.email && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text)' }}>E-posta:</strong> {item.email}
                    </span>
                  )}
                  {item.telefon && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text)' }}>Tel No:</strong> {item.telefon}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Mesaj:</strong>
                  {item.mesaj}
                </div>
              </>
            )}
            {collectionId === 'reviews' && (
              <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
                 <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Yorum:</strong>
                 "{item.comment}"
              </div>
            )}
            {collectionId === 'coupons' && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  {item.companyName && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text)' }}>Firma:</strong> {item.companyName}
                    </span>
                  )}
                  <span style={{ color: item.isActive ? '#22c55e' : '#ef4444' }}>
                    <strong>{item.isActive ? '✅ AKTIF' : '❌ PASIF'}</strong>
                  </span>
                  {item.expiry_date?.toDate && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text)' }}>Bitiş:</strong> {format(item.expiry_date.toDate(), 'dd.MM.yyyy')}
                    </span>
                  )}
                  {item.total_limit && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text)' }}>Limit:</strong> {item.used_count || 0} / {item.total_limit}
                    </span>
                  )}
                </div>
                {item.description && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
                    <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Kupon Detayı:</strong>
                    {item.description}
                  </div>
                )}
              </>
            )}
            {collectionId === 'sikayetler' && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  {item.userName && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text)' }}>Şikayet Edilen:</strong> {item.userName}
                    </span>
                  )}
                  {item.status && (
                    <span style={{ 
                      color: item.status === 'dismissed' ? '#22c55e' : (item.status === 'reviewed_deleted' ? '#ef4444' : '#f59e0b'),
                      background: 'rgba(0,0,0,0.2)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {item.status.toUpperCase()}
                    </span>
                  )}
                  {item.timestamp?.toDate && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text)' }}>Tarih:</strong> {format(item.timestamp.toDate(), 'dd.MM.yyyy HH:mm')}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Yorum İçeriği:</strong>
                  "{item.content}"
                </div>
              </>
            )}
            {collectionId === 'otobus_saatleri' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {item.saatler_hergun && (
                  <div>
                    <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Her Gün (Tüm Haftalık):</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {item.saatler_hergun.split(',').map((t: string) => (
                        <span key={t} style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {item.saatler_haftaici && (
                  <div>
                    <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Hafta İçi:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {item.saatler_haftaici.split(',').map((t: string) => (
                        <span key={t} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {item.saatler_cumartesi && (
                  <div>
                    <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Cumartesi:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {item.saatler_cumartesi.split(',').map((t: string) => (
                        <span key={t} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {item.saatler_pazar && (
                  <div>
                    <strong style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Pazar:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {item.saatler_pazar.split(',').map((t: string) => (
                        <span key={t} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {item.duraklar && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <strong>Duraklar:</strong> {item.duraklar}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!(collectionId === 'yardim_destek' || collectionId === 'reviews' || collectionId === 'coupons' || collectionId === 'sikayetler' || collectionId === 'otobus_saatleri') && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {(item.hakkinda || item.konum || '')?.substring(0, 100)}...
          </div>
        )}
      </td>
        {collectionId === 'sikayetler' && (
          <td style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '100px' }}>
              {item.status === 'pending' ? (
                <button
                  onClick={async () => {
                    if (!window.confirm('Bu yorumu sistemden kalıcı olarak silmek istiyor musunuz?')) return;
                    try {
                      const reviewPath = `reviews/${item.reviewId}`;
                      await deleteDoc(doc(db, reviewPath));
                      await deleteDoc(doc(db, 'sikayetler', item.id));
                      alert('Yorum ve şikayet kaydı başarıyla silindi.');
                    } catch (e: any) {
                      console.error(e);
                      alert('Yorum silinirken hata: ' + e.message);
                    }
                  }}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}
                >
                  YORUMU SİL
                </button>
              ) : (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  İŞLEM YAPILDI
                </span>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.65rem',
                  marginTop: '4px'
                }}
              >
                Raporu Sil
              </button>
            </div>
          </td>
        )}
        {collectionId === 'yardim_destek' && (
          <td style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '100px' }}>
              <span style={{ 
                fontSize: '0.65rem', 
                fontWeight: 800, 
                color: item.durum === 'Çözüldü' ? '#22c55e' : '#f59e0b',
                background: item.durum === 'Çözüldü' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                padding: '2px 8px',
                borderRadius: '50px',
                textAlign: 'center',
                border: `1px solid ${item.durum === 'Çözüldü' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
              }}>
                {item.durum?.toUpperCase() || 'BEKLIYOR'}
              </span>
              <label className="switch" style={{ alignSelf: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={item.durum === 'Çözüldü'} 
                  onChange={async (e) => {
                    const newStatus = e.target.checked ? 'Çözüldü' : 'Bekliyor';
                    try {
                      await updateDoc(doc(db, collectionId, item.id), { durum: newStatus });
                      
                      // Bildirim gönderme (Eğer durum 'Çözüldü' ise ve token varsa)
                      if (e.target.checked && item.fcm_token) {
                        await sendFCMNotification(
                          'Destek Talebiniz Çözüldü ✅',
                          `${item.kategori || 'Destek'} konulu talebiniz başarıyla çözülmüştür.`,
                          '/', // Ana sayfaya yönlendir
                          item.fcm_token
                        );
                        console.log('Kullanıcıya özel bildirim gönderildi.');
                      }
                    } catch (err) {
                      console.error('Destek güncelleme hatası:', err);
                      alert('Durum güncellenemedi.');
                    }
                  }}
                />
                <span className="slider"></span>
              </label>
              <button 
                className="btn btn-danger" 
                style={{ 
                  padding: '0.4rem', 
                  borderRadius: '8px', 
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  marginTop: '4px'
                }} 
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 size={14} />
                Sil
              </button>
            </div>
          </td>
        )}
        {!(collectionId === 'yardim_destek' || collectionId === 'sikayetler') && (
          <td style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', width: '36px', height: '36px', justifyContent: 'center' }} onClick={() => handleOpenModal(item)}>
                <Edit size={16} />
              </button>
              <button className="btn btn-danger" style={{ padding: '0.5rem', borderRadius: '50%', width: '36px', height: '36px', justifyContent: 'center' }} onClick={() => handleDelete(item.id, item.image_url)}>
                <Trash2 size={16} />
              </button>
            </div>
          </td>
        )}
    </tr>
  );
};

export default ManageCollection;
