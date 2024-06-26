package justchat.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "Users")
public class User extends BaseModel implements Comparable<User> {

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    public void setUsername(String username) {
        this.username = username.toLowerCase().trim();
    }

    @Column(length = 100)
    private String password;

    @Column(length = 100)
    private String firstname;

    @Column(length = 100)
    private String lastname;

    @Transient
    private Boolean rememberMe;

    public static String validateFirstname(String s) {
        int lb = 1, ub = 90;
        if (s.length() < lb || s.length() > ub) {
            return "Имя должно быть длиной от " + lb + " до " + ub + " символов";
        } else {
            if (hasIllegalCharacters(s)) {
                return "В имени содержатся недопустимые символы";
            }
            return null;
        }
    }

    public static String validateLastname(String s) {
        int lb = 1, ub = 90;
        if (s.length() < lb || s.length() > ub) {
            return "Фамилия должна быть длиной от " + lb + " до " + ub + " символов";
        } else {
            if (hasIllegalCharacters(s)) {
                return "В фамилии содержатся недопустимые символы";
            }
            return null;
        }
    }

    public static String validateUsername(String s) {
        int lb = 1, ub = 90;
        if (s.length() < lb || s.length() > ub) {
            return "Логин должен быть длиной от " + lb + " до " + ub + " символов";
        } else {
            if (hasIllegalCharacters(s)) {
                return "В логине содержатся недопустимые символы";
            }
            return null;
        }
    }

    public static String validatePassword(String s) {
        int lb = 6, ub = 90;
        if (s.length() < lb || s.length() > ub) {
            return "Пароль должен быть длиной от " + lb + " до " + ub + " символов";
        } else {
            if (hasIllegalCharacters(s)) {
                return "В пароле содержатся недопустимые символы";
            }
            return null;
        }
    }

    public static boolean hasIllegalCharacters(String s) {
        boolean ok = true;
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (!(Character.isLetterOrDigit(ch) || (ch >= 32 && ch <= 46) || (ch == 64))) {
                ok = false;
                break;
            }
        }
        return !ok;
    }

    public static String validateAll(User user) {
        String problem = User.validateFirstname(user.getFirstname());
        if (problem == null) {
            problem = User.validateLastname(user.getLastname());
        }
        if (problem == null) {
            problem = User.validateUsername(user.getUsername());
        }
        if (problem == null) {
            problem = User.validatePassword(user.getPassword());
        }
        return problem;
    }

    @Override
    public int compareTo(User user) {
        return getPresentation().compareTo(user.getPresentation());
    }

    public String getPresentation() {
        return firstname + " " + lastname;
    }
}
