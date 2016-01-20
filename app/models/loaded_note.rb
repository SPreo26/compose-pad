class LoadedNote < ActiveRecord::Base
  belongs_to :note_file

  def self.get_json_no_time_duplicates(file)
    
    notes=file.loaded_notes.order(:start_index)
    new_notes=[]
    notes.each do |note|
      if new_notes.empty? || new_notes.last.start_index != note.start_index
        new_notes<<note
      end
    end

    return new_notes.as_json

  end
  
end
