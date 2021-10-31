package space.legalis.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Translation.
 */
@Document(collection = "translation")
public class Translation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("note")
    private String note;

    @Field("author")
    private String author;

    @Field("source")
    private String source;

    @Field("official")
    private Boolean official;

    @Field("content")
    private String content;

    @DBRef
    @Field("language")
    private Language language;

    @DBRef
    @Field("law")
    @JsonIgnoreProperties(value = { "translations", "treaties", "laws", "country", "ref" }, allowSetters = true)
    private Law law;

    @DBRef
    @Field("treaty")
    @JsonIgnoreProperties(value = { "statements", "translations", "countries", "law" }, allowSetters = true)
    private Treaty treaty;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Translation id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNote() {
        return this.note;
    }

    public Translation note(String note) {
        this.setNote(note);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getAuthor() {
        return this.author;
    }

    public Translation author(String author) {
        this.setAuthor(author);
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getSource() {
        return this.source;
    }

    public Translation source(String source) {
        this.setSource(source);
        return this;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Boolean getOfficial() {
        return this.official;
    }

    public Translation official(Boolean official) {
        this.setOfficial(official);
        return this;
    }

    public void setOfficial(Boolean official) {
        this.official = official;
    }

    public String getContent() {
        return this.content;
    }

    public Translation content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Language getLanguage() {
        return this.language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Translation language(Language language) {
        this.setLanguage(language);
        return this;
    }

    public Law getLaw() {
        return this.law;
    }

    public void setLaw(Law law) {
        this.law = law;
    }

    public Translation law(Law law) {
        this.setLaw(law);
        return this;
    }

    public Treaty getTreaty() {
        return this.treaty;
    }

    public void setTreaty(Treaty treaty) {
        this.treaty = treaty;
    }

    public Translation treaty(Treaty treaty) {
        this.setTreaty(treaty);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Translation)) {
            return false;
        }
        return id != null && id.equals(((Translation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Translation{" +
            "id=" + getId() +
            ", note='" + getNote() + "'" +
            ", author='" + getAuthor() + "'" +
            ", source='" + getSource() + "'" +
            ", official='" + getOfficial() + "'" +
            ", content='" + getContent() + "'" +
            "}";
    }
}
